import { supabase } from '../lib/supabase'

export const categoryService = {
  async getCategories(userId: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    return { data, error }
  },

  async createCategory(
    userId: string,
    name: string,
    keywords: string[] = []
  ) {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        name,
        keywords,
      })
      .select()
      .single()

    return { data, error }
  },

  async updateCategory(
    categoryId: string,
    updates: {
      name?: string
      keywords?: string[]
    }
  ) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', categoryId)
      .select()
      .single()

    return { data, error }
  },

  async deleteCategory(categoryId: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    return { error }
  },
}
