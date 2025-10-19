import { supabase } from '../lib/supabase'

export const bookmarkService = {
  async getBookmarks(userId: string, folderId?: string) {
    let query = supabase
      .from('bookmarks')
      .select('*, folders(name), categories(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (folderId) {
      query = query.eq('folder_id', folderId)
    }

    const { data, error } = await query

    return { data, error }
  },

  async getFavoriteBookmarks(userId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*, folders(name), categories(name)')
      .eq('user_id', userId)
      .eq('is_favorite', true)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  async createBookmark(
    userId: string,
    bookmarkData: {
      url: string
      title: string
      folder_id?: string
      category_id?: string
      is_favorite?: boolean
    }
  ) {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        ...bookmarkData,
      })
      .select()
      .single()

    return { data, error }
  },

  async updateBookmark(
    bookmarkId: string,
    updates: {
      title?: string
      url?: string
      folder_id?: string
      category_id?: string
      is_favorite?: boolean
    }
  ) {
    const { data, error } = await supabase
      .from('bookmarks')
      .update(updates)
      .eq('id', bookmarkId)
      .select()
      .single()

    return { data, error }
  },

  async deleteBookmark(bookmarkId: string) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', bookmarkId)

    return { error }
  },

  async toggleFavorite(bookmarkId: string, isFavorite: boolean) {
    return this.updateBookmark(bookmarkId, { is_favorite: isFavorite })
  },

  async moveBookmarks(bookmarkIds: string[], targetFolderId: string | null) {
    const { data, error } = await supabase
      .from('bookmarks')
      .update({ folder_id: targetFolderId })
      .in('id', bookmarkIds)
      .select()

    return { data, error }
  },

  async deleteBookmarks(bookmarkIds: string[]) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .in('id', bookmarkIds)

    return { error }
  },

  async searchBookmarks(userId: string, query: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*, folders(name), categories(name)')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,url.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    return { data, error }
  },
}
