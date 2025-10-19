import { supabase } from '../lib/supabase'

export const folderService = {
  async getFolders(userId: string, includeHidden: boolean = false) {
    let query = supabase
      .from('folders')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true })

    if (!includeHidden) {
      query = query.eq('is_hidden', false)
    }

    const { data, error } = await query

    return { data, error }
  },

  async createFolder(userId: string, name: string) {
    const { data: folders } = await this.getFolders(userId, true)
    const nextSortOrder = folders ? folders.length : 0

    const { data, error } = await supabase
      .from('folders')
      .insert({
        user_id: userId,
        name,
        sort_order: nextSortOrder,
      })
      .select()
      .single()

    return { data, error }
  },

  async updateFolder(
    folderId: string,
    updates: {
      name?: string
      is_hidden?: boolean
      sort_order?: number
    }
  ) {
    const { data, error } = await supabase
      .from('folders')
      .update(updates)
      .eq('id', folderId)
      .select()
      .single()

    return { data, error }
  },

  async deleteFolder(folderId: string) {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId)

    return { error }
  },

  async reorderFolders(userId: string, folderIds: string[]) {
    const updates = folderIds.map((id, index) => ({
      id,
      user_id: userId,
      sort_order: index,
    }))

    const { data, error } = await supabase
      .from('folders')
      .upsert(updates)
      .select()

    return { data, error }
  },
}
