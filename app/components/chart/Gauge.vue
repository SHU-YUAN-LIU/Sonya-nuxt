<template>
    <div class="card-container">
        <div class="flex gap-2">
            <span class="card-title">{{ title }}</span>
        </div>
        <div class="chart" ref="chartRef"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import echarts from '@/utils/echarts'
import { useNumberFormat } from '@/composables/useNumberFormat' // 引入格式化數字的函數
const { formatThousand } = useNumberFormat()

const props = defineProps({
    title: { type: String, default: 'title' },
    barColor: { type: String, default: '#00E396' },
    maxValue: { type: Number, default: 60 },
    minValue: { type: Number, default: 0 },
    value: { type: Number, default: 35 },
    showPointer: { type: Boolean, default: false },
    warningLine: { type: Number, default: 46.4 },
    dangerLine: { type: Number, default: 55 },
    showWarningLines: { type: Boolean, default: false }, //是否顯示警告線和緊急線
    splitNumber: { type: Number, default: 4 }, //儀表刻度分割段数(大刻度)
    lineSplitNumber: { type: Number, default: 2 }, //分隔線之间：分割的刻度数(小刻度)
    tooltip: { type: Boolean, default: false }, //提示框
    unit: { type: String, default: 'KW' }, //單位
    needFormatThousand: { type: Boolean, default: true }, //是否需要千分位格式化，預設要(萬一之後有不需要的，可以另外傳false)
    decimalPlaces: { type: Number, default: 1 } //小數位數
})
const tagStyle = computed(() => ({
    backgroundColor: props.tagBackgroundColor,
    color: '#FFFFFF',
    border: 'none'
}))
const chartRef = ref(null)
let myChart = null
let progressWidth = ref(null)
const currentRadius = ref('80%') //儀表大小
const chartCenter = ref(['50%', '70%']) //儀表位置

// 判斷當前視窗寬度並設置對應的radius(圖表大小)
const updateRadiusBasedOnWidth = () => {
    if (window.innerWidth >= 1920) {
        currentRadius.value = '83%' //儀表大小
        progressWidth.value = 28 //儀表bar
    } else {
        currentRadius.value = '84%' //儀表大小
        progressWidth.value = 25 //儀表bar
    }

    // 如果圖表已初始化，則更新設置（用 notMerge 完整重繪，確保 axisLine 寬度和色段同步更新）
    if (myChart) {
        myChart.setOption(chartOption.value, { notMerge: true })
    }
}

// 計算 axisLine 色段，讓進度條永遠從 0 出發
const axisLineColors = computed(() => {
    const min = props.minValue
    const max = props.maxValue
    const val = props.value
    const range = max - min
    if (range <= 0) return [[1, '#BCC5E0']] //色

    const bgColor = '#ffffff' // 背景色（卡片底色，讓未填充區域透出白色，與原本一致）
    const barColor = props.barColor // 填充色

    // 各關鍵點在 [0,1] 軸上的比例
    const zeroRatio = Math.min(Math.max((0 - min) / range, 0), 1)
    const valueRatio = Math.min(Math.max((val - min) / range, 0), 1)

    if (val >= 0) {
        // 正值：0 → value 填色，其餘背景
        const segments = []
        if (zeroRatio > 0) segments.push([zeroRatio, bgColor])
        if (valueRatio > zeroRatio) segments.push([valueRatio, barColor])
        if (valueRatio < 1) segments.push([1, bgColor])
        return segments.length ? segments : [[1, bgColor]]
    } else {
        // 負值：value → 0 填色，其餘背景
        const segments = []
        if (valueRatio > 0) segments.push([valueRatio, bgColor])
        if (zeroRatio > valueRatio) segments.push([zeroRatio, barColor])
        if (zeroRatio < 1) segments.push([1, bgColor])
        return segments.length ? segments : [[1, bgColor]]
    }
})

const chartOption = computed(() => ({
    tooltip: {
        show: props.tooltip,
        formatter: '警告值: {c}' + props.unit,
        trigger: 'item',
        position: 'right',
        borderColor: '#fff',
        padding: [8, 10]
    },

    series: [
        // 第一個系列：進度條 + 小刻度（z:10，層級低）
        {
            type: 'gauge',
            center: chartCenter.value,
            radius: currentRadius.value,
            startAngle: 180,
            endAngle: 0,
            min: props.minValue,
            max: props.maxValue,
            splitNumber: props.splitNumber,
            z: 10,
            axisLine: {
                lineStyle: {
                    width: progressWidth.value, //進度條寬度
                    color: axisLineColors.value
                }
            },
            // ✅ 小刻度移到這裡（z:10，會被大刻度蓋住）
            axisTick: {
                distance: -(progressWidth.value / 2 + 22), // ✅ 補償 progressWidth 讓位置對齊第二個 series
                splitNumber: props.lineSplitNumber,
                lineStyle: {
                    width: 1,
                    color: '#BCC5E0'
                }
            },
            progress: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            pointer: { show: false },
            detail: { show: false },
            data: [{ value: props.value }]
        },
        // 第二個系列：大刻度 + 標籤（z:20，蓋在小刻度上面）
        {
            type: 'gauge',
            center: chartCenter.value,
            radius: currentRadius.value,
            startAngle: 180,
            endAngle: 0,
            min: props.minValue,
            max: props.maxValue,
            splitNumber: props.splitNumber,
            z: 20,
            progress: { show: false },
            axisTick: { show: false }, // ✅ 不顯示小刻度
            axisLine: {
                lineStyle: {
                    width: 2,
                    color: [[1, '#BCC5E0']]
                }
            },
            splitLine: {
                distance: -10,
                length: 6,
                lineStyle: {
                    width: 2,
                    color: '#717EA4'
                }
            },
            axisLabel: {
                distance: -28,
                color: '#2A3042',
                fontSize: 14,
                padding: [0, 0, 0, 0],
                formatter: function (value) {
                    if (value === props.maxValue) {
                        if (props.maxValue >= 10000) {
                            return '{maxValue15000|' + value + '}'
                        } else if (props.maxValue >= 1000) {
                            return '{maxValue1000|' + value + '}'
                        } else if (props.maxValue >= 99) {
                            return '{maxValue99|' + value + '}'
                        }
                    }
                    // ✅ 新增：最小值為負數時，根據位數調整位置
                    if (value === props.minValue && props.minValue < 0) {
                        return '{minValueSmall|' + value + '}'
                    }
                    return value
                },
                rich: {
                    maxValue99: {
                        padding: [0, -3, 0, 0], // 最大值 >= 1000 時的樣式
                        fontSize: 14,
                        color: '#2A3042'
                    },
                    maxValue1000: {
                        padding: [0, -10, 0, 0], // 最大值 >= 1000 時的樣式
                        fontSize: 14,
                        color: '#2A3042'
                    },
                    maxValue15000: {
                        padding: [0, -16, 0, 0], // 最大值 >= 15000 時的樣式
                        fontSize: 14,
                        color: '#2A3042'
                    },
                    // ✅ 新增：最小值負數的樣式（padding 左移讓文字往外推）
                    minValueSmall: {
                        padding: [0, 0, 0, -12], // -10 ~ -9 這類兩位數負數
                        fontSize: 14,
                        color: '#2A3042'
                    }
                }
            },
            pointer: { show: false },
            detail: {
                valueAnimation: true,
                width: '60%',
                lineHeight: 60,
                borderRadius: 8,
                offsetCenter: [0, '35%'], //數值位置
                fontSize: window.innerWidth < 1920 ? 18 : 20, //數值字體大小
                fontWeight: '800',
                // formatter: () => {
                //   if (props.needFormatThousand) {
                //     return formatThousand(props.value, props.decimalPlaces, true) + '\u00A0' + props.unit
                //   } else {
                //     return props.value + '\u00A0' + props.unit
                //   }
                // },
                color: '#000000'
            },
            data: [{ value: props.value }]
        },
        // 警告指針
        {
            type: 'gauge',
            center: chartCenter.value,
            radius: currentRadius.value,
            startAngle: 180,
            endAngle: 0,
            min: props.minValue,
            max: props.maxValue,
            z: 40,
            axisLine: { show: false },
            splitLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            pointer: {
                show: props.showWarningLines,
                length: '90%',
                width: 2,
                icon: 'roundRect',
                offsetCenter: [0, 0],
                opacity: 0.8,
                itemStyle: { color: '#FF9500' }
            },
            detail: { show: false },
            data: [{ value: props.warningLine }]
        },
        // 危險指針
        {
            type: 'gauge',
            center: chartCenter.value,
            radius: currentRadius.value,
            startAngle: 180,
            endAngle: 0,
            min: props.minValue,
            max: props.maxValue,
            z: 40,
            axisLine: { show: false },
            splitLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            pointer: {
                show: props.showWarningLines,
                length: '90%',
                width: 2,
                icon: 'roundRect',
                offsetCenter: [0, 0],
                opacity: 0.8,
                itemStyle: { color: '#FF3535' }
            },
            detail: { show: false },
            data: [{ value: props.dangerLine }]
        }
    ]
}))

onMounted(() => {
    //初始設置基於視窗寬度的radius
    updateRadiusBasedOnWidth()

    if (chartRef.value) {
        myChart = echarts.init(chartRef.value)
        myChart.setOption(chartOption.value)
    }

    window.addEventListener('resize', handleResize)
})

const handleResize = () => {
    // 調整圖表尺寸
    if (myChart) {
        updateRadiusBasedOnWidth() // 更新半徑
        myChart.resize()
    }
}

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (myChart) {
        myChart.dispose()
    }
})

// 監聽數值變化：value 改變時需要重算 axisLine 色段，用 notMerge 完整更新
watch(
    () => props.value,
    () => {
        if (myChart) {
            myChart.setOption(chartOption.value, { notMerge: true })
        }
    }
)
//監聽:最大值、最小值、單位、小數位數變化
watch(
    () => [
        props.maxValue,
        props.minValue,
        props.unit,
        props.decimalPlaces,
        props.warningLine,
        props.dangerLine
    ],
    ([newMaxValue, newMinValue, newUnit, newDecimalPlaces, newWarningLine, newDangerLine]) => {
        if (myChart) {
            // 使用 notMerge: true 完全重繪圖表，而不是合併舊配置
            myChart.setOption(chartOption.value, { notMerge: true })
        }
    }
)
</script>
<style lang="scss" scoped>
@import '@/styles/components/card.scss'; //卡片

.chart {
    flex-grow: 1; // 有剩餘空間就填滿
    flex-shrink: 1; // 空間不足時可以縮小
    height: 0; // 把 flex-basis 的基礎高度歸零
    min-height: 0; // ← 移除瀏覽器對 flex 子項目的預設 min-height: auto
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (width<=1024px) {
        min-height: 140px;
    }
}
</style>
