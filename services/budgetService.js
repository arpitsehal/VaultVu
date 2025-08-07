import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.7:5000/api/budget';

// Get the auth token for authenticated requests
const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

// Get all budget categories for the user
export async function getBudgetCategories() {
  try {
    // First try to get from API
    const token = await getToken();
    if (token) {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (data.success) {
        // Save to local storage as backup
        await AsyncStorage.setItem('budgetCategories', JSON.stringify(data.categories));
        return { success: true, categories: data.categories };
      }
    }
    
    // If API fails or no token, try to get from local storage
    const storedCategories = await AsyncStorage.getItem('budgetCategories');
    if (storedCategories) {
      return { success: true, categories: JSON.parse(storedCategories) };
    }
    
    // If nothing is available, return default categories
    const defaultCategories = [
      { id: 1, name: 'Housing', budget: 15000, spent: 0 },
      { id: 2, name: 'Food', budget: 8000, spent: 0 },
      { id: 3, name: 'Transportation', budget: 5000, spent: 0 },
      { id: 4, name: 'Entertainment', budget: 3000, spent: 0 },
      { id: 5, name: 'Utilities', budget: 4000, spent: 0 },
    ];
    await AsyncStorage.setItem('budgetCategories', JSON.stringify(defaultCategories));
    return { success: true, categories: defaultCategories };
  } catch (error) {
    console.error('Error fetching budget categories:', error);
    return { success: false, message: 'Failed to fetch budget categories' };
  }
}

// Add a new budget category
export async function addBudgetCategory(category) {
  try {
    // Try to add via API first
    const token = await getToken();
    if (token) {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(category),
      });
      const data = await response.json();
      if (data.success) {
        // Update local storage
        const storedCategories = await AsyncStorage.getItem('budgetCategories');
        const categories = storedCategories ? JSON.parse(storedCategories) : [];
        categories.push(data.category);
        await AsyncStorage.setItem('budgetCategories', JSON.stringify(categories));
        return { success: true, category: data.category };
      }
    }
    
    // If API fails or no token, add to local storage only
    const storedCategories = await AsyncStorage.getItem('budgetCategories');
    const categories = storedCategories ? JSON.parse(storedCategories) : [];
    const newCategory = {
      ...category,
      id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1
    };
    categories.push(newCategory);
    await AsyncStorage.setItem('budgetCategories', JSON.stringify(categories));
    return { success: true, category: newCategory };
  } catch (error) {
    console.error('Error adding budget category:', error);
    return { success: false, message: 'Failed to add budget category' };
  }
}

// Update a budget category
export async function updateBudgetCategory(categoryId, updates) {
  try {
    // Try to update via API first
    const token = await getToken();
    if (token) {
      const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (data.success) {
        // Update local storage
        const storedCategories = await AsyncStorage.getItem('budgetCategories');
        if (storedCategories) {
          const categories = JSON.parse(storedCategories);
          const updatedCategories = categories.map(cat => 
            cat.id === categoryId ? { ...cat, ...updates } : cat
          );
          await AsyncStorage.setItem('budgetCategories', JSON.stringify(updatedCategories));
        }
        return { success: true, category: data.category };
      }
    }
    
    // If API fails or no token, update in local storage only
    const storedCategories = await AsyncStorage.getItem('budgetCategories');
    if (storedCategories) {
      const categories = JSON.parse(storedCategories);
      const updatedCategories = categories.map(cat => 
        cat.id === categoryId ? { ...cat, ...updates } : cat
      );
      await AsyncStorage.setItem('budgetCategories', JSON.stringify(updatedCategories));
      const updatedCategory = updatedCategories.find(cat => cat.id === categoryId);
      return { success: true, category: updatedCategory };
    }
    return { success: false, message: 'Category not found' };
  } catch (error) {
    console.error('Error updating budget category:', error);
    return { success: false, message: 'Failed to update budget category' };
  }
}

// Delete a budget category
export async function deleteBudgetCategory(categoryId) {
  try {
    // Try to delete via API first
    const token = await getToken();
    if (token) {
      const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (data.success) {
        // Update local storage
        const storedCategories = await AsyncStorage.getItem('budgetCategories');
        if (storedCategories) {
          const categories = JSON.parse(storedCategories);
          const updatedCategories = categories.filter(cat => cat.id !== categoryId);
          await AsyncStorage.setItem('budgetCategories', JSON.stringify(updatedCategories));
        }
        return { success: true };
      }
    }
    
    // If API fails or no token, delete from local storage only
    const storedCategories = await AsyncStorage.getItem('budgetCategories');
    if (storedCategories) {
      const categories = JSON.parse(storedCategories);
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      await AsyncStorage.setItem('budgetCategories', JSON.stringify(updatedCategories));
      return { success: true };
    }
    return { success: false, message: 'Category not found' };
  } catch (error) {
    console.error('Error deleting budget category:', error);
    return { success: false, message: 'Failed to delete budget category' };
  }
}

// Add a transaction to a category
export async function addTransaction(categoryId, transaction) {
  try {
    // Try to add via API first
    const token = await getToken();
    if (token) {
      const response = await fetch(`${API_URL}/categories/${categoryId}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transaction),
      });
      const data = await response.json();
      if (data.success) {
        // Update local storage with the updated category
        const storedCategories = await AsyncStorage.getItem('budgetCategories');
        if (storedCategories) {
          const categories = JSON.parse(storedCategories);
          const updatedCategories = categories.map(cat => 
            cat.id === categoryId ? data.category : cat
          );
          await AsyncStorage.setItem('budgetCategories', JSON.stringify(updatedCategories));
        }
        return { success: true, transaction: data.transaction };
      }
    }
    
    // If API fails or no token, update local storage only
    const storedCategories = await AsyncStorage.getItem('budgetCategories');
    if (storedCategories) {
      const categories = JSON.parse(storedCategories);
      const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
      
      if (categoryIndex !== -1) {
        // Add the transaction and update the spent amount
        const category = categories[categoryIndex];
        const newTransaction = {
          id: Date.now(),
          ...transaction,
          date: new Date().toISOString()
        };
        
        // If the category doesn't have transactions array, create it
        if (!category.transactions) {
          category.transactions = [];
        }
        
        category.transactions.push(newTransaction);
        category.spent = (category.spent || 0) + (transaction.amount || 0);
        
        categories[categoryIndex] = category;
        await AsyncStorage.setItem('budgetCategories', JSON.stringify(categories));
        return { success: true, transaction: newTransaction };
      }
    }
    return { success: false, message: 'Category not found' };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return { success: false, message: 'Failed to add transaction' };
  }
}