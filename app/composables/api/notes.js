export const useNotesApi = () => {
  const { GET, POST, DELETE } = useApi()
  return {
    getNotes: () => GET('/api/notes'),
    addNote: (data) => POST('/api/notes', data),
    deleteNote: (id) => DELETE(`/api/notes/${id}`)
  }
}
