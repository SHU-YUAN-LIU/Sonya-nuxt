import * as echarts from 'echarts/core'

import { GaugeChart, BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  LegendComponent,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  MarkLineComponent,
  ToolboxComponent,
  GraphicComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  GaugeChart,
  BarChart,
  LineChart,
  LegendComponent,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  CanvasRenderer,
  MarkLineComponent,
  ToolboxComponent,
  PieChart,
  GraphicComponent
])

export default echarts
