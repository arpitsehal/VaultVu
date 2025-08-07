// BudgetTrackerScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar, 
  ScrollView, 
  Platform, 
  TextInput, 
  KeyboardAvoidingView,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import * as budgetService from '../services/budgetService';

export default function BudgetTrackerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { translations } = useLanguage();
  
  // State for budget categories
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for modals
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
  const [editCategoryModalVisible, setEditCategoryModalVisible] = useState(false);
  const [addTransactionModalVisible, setAddTransactionModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Form states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryBudget, setNewCategoryBudget] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  
  // Load budget categories when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadBudgetCategories();
    }, [])
  );
  
  // Load budget categories from API/storage
  const loadBudgetCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await budgetService.getBudgetCategories();
      if (result.success) {
        setCategories(result.categories);
      } else {
        setError(result.message || translations.addCategoryFailed || 'Failed to load budget categories');
      }
    } catch (err) {
      setError(translations.unexpectedError || 'An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate total budget and spending
  const totalBudget = categories.reduce((sum, category) => sum + category.budget, 0);
  const totalSpent = categories.reduce((sum, category) => sum + category.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  
  // Calculate percentage spent for progress bars
  const getPercentageSpent = (spent, budget) => {
    return Math.min((spent / budget) * 100, 100);
  };
  
  // Get color based on percentage spent
  const getColorForPercentage = (percentage) => {
    if (percentage < 50) return '#4CAF50'; // Green
    if (percentage < 75) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };
  
  // Handle adding a new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !newCategoryBudget.trim()) {
      Alert.alert(translations.addCategoryError || 'Error', translations.addCategoryError || 'Please enter both name and budget amount');
      return;
    }
    
    const budgetAmount = parseFloat(newCategoryBudget);
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      Alert.alert(translations.addCategoryError || 'Error', translations.addCategoryInvalidAmount || 'Please enter a valid budget amount');
      return;
    }
    
    setLoading(true);
    try {
      const result = await budgetService.addBudgetCategory({
        name: newCategoryName,
        budget: budgetAmount
      });
      
      if (result.success) {
        setCategories([...categories, result.category]);
        setNewCategoryName('');
        setNewCategoryBudget('');
        setAddCategoryModalVisible(false);
      } else {
        Alert.alert(translations.addCategoryFailed || 'Error', result.message || translations.addCategoryFailed || 'Failed to add category');
      }
    } catch (err) {
      Alert.alert(translations.unexpectedError || 'Error', translations.unexpectedError || 'An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle updating a category
  const handleUpdateCategory = async () => {
    if (!newCategoryName.trim() || !newCategoryBudget.trim() || !selectedCategory) {
      Alert.alert(translations.addCategoryError || 'Error', translations.addCategoryError || 'Please enter both name and budget amount');
      return;
    }
    
    const budgetAmount = parseFloat(newCategoryBudget);
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      Alert.alert(translations.addCategoryError || 'Error', translations.addCategoryInvalidAmount || 'Please enter a valid budget amount');
      return;
    }
    
    setLoading(true);
    try {
      const result = await budgetService.updateBudgetCategory(selectedCategory.id, {
        name: newCategoryName,
        budget: budgetAmount
      });
      
      if (result.success) {
        setCategories(categories.map(cat => 
          cat.id === selectedCategory.id ? { ...cat, name: newCategoryName, budget: budgetAmount } : cat
        ));
        setNewCategoryName('');
        setNewCategoryBudget('');
        setSelectedCategory(null);
        setEditCategoryModalVisible(false);
      } else {
        Alert.alert(translations.editCategory || 'Error', result.message || translations.editCategoryFailed || 'Failed to update category');
      }
    } catch (err) {
      Alert.alert(translations.unexpectedError || 'Error', translations.unexpectedError || 'An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle deleting a category
  const handleDeleteCategory = async (categoryId) => {
    Alert.alert(
      translations.confirmDeleteTitle || 'Confirm Delete',
      translations.confirmDeleteMessage || 'Are you sure you want to delete this category? This action cannot be undone.',
      [
        { text: translations.modalCancelButtonText || 'Cancel', style: 'cancel' },
        {
          text: translations.delete || 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            // In handleDeleteCategory function
            try {
              console.log('Deleting category with ID:', categoryId);
              const result = await budgetService.deleteBudgetCategory(categoryId);
              console.log('Delete result:', result);
              if (result.success) {
                setCategories(categories.filter(cat => cat.id !== categoryId));
              } else {
                Alert.alert(translations.delete || 'Error', result.message || translations.deleteCategoryFailed || 'Failed to delete category');
              }
            } catch (err) {
              Alert.alert(translations.unexpectedError || 'Error', translations.unexpectedError || 'An unexpected error occurred');
              console.error('Detailed delete error:', err);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  // Handle adding a transaction
  const handleAddTransaction = async () => {
    if (!transactionDescription.trim() || !transactionAmount.trim() || !selectedCategory) {
      Alert.alert(translations.addTransactionError || 'Error', translations.addTransactionError || 'Please enter both description and amount');
      return;
    }
    
    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert(translations.addTransactionInvalidAmount || 'Error', translations.addTransactionInvalidAmount || 'Please enter a valid amount');
      return;
    }
    
    setLoading(true);
    try {
      const result = await budgetService.addTransaction(selectedCategory.id, {
        description: transactionDescription,
        amount: amount
      });
      
      if (result.success) {
        setCategories(categories.map(cat => {
          if (cat.id === selectedCategory.id) {
            return {
              ...cat,
              spent: (cat.spent || 0) + amount,
              transactions: [...(cat.transactions || []), result.transaction]
            };
          }
          return cat;
        }));
        
        setTransactionDescription('');
        setTransactionAmount('');
        setSelectedCategory(null);
        setAddTransactionModalVisible(false);
      } else {
        Alert.alert(translations.addTransactionFailed || 'Error', result.message || translations.addTransactionFailed || 'Failed to add transaction');
      }
    } catch (err) {
      Alert.alert(translations.unexpectedError || 'Error', translations.unexpectedError || 'An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Open edit category modal
  const openEditCategoryModal = (category) => {
    setSelectedCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryBudget(category.budget.toString());
    setEditCategoryModalVisible(true);
  };
  
  // Open add transaction modal
  const openAddTransactionModal = (category) => {
    setSelectedCategory(category);
    setTransactionDescription('');
    setTransactionAmount('');
    setAddTransactionModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A213B" />

      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#A8C3D1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translations.budgetTracker || 'Budget Tracker'}</Text>
        <View style={{ width: 40 }} /> {/* Spacer to balance header title */}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A8C3D1" />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadBudgetCategories}>
            <Text style={styles.retryButtonText}>{translations.retry || 'Retry'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>{translations.budgetSummary || 'Budget Summary'}</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{translations.totalBudget || 'Total Budget:'}</Text>
                <Text style={styles.summaryValue}>₹ {totalBudget.toLocaleString()}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{translations.totalSpent || 'Total Spent:'}</Text>
                <Text style={styles.summaryValue}>₹ {totalSpent.toLocaleString()}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{translations.remaining || 'Remaining:'}</Text>
                <Text style={[styles.summaryValue, { color: remainingBudget >= 0 ? '#4CAF50' : '#F44336' }]}>
                  ₹ {remainingBudget.toLocaleString()}
                </Text>
              </View>
              
              {/* Overall Progress Bar */}
              <View style={styles.overallProgressContainer}>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[styles.progressBarFill, { 
                      width: `${getPercentageSpent(totalSpent, totalBudget)}%`,
                      backgroundColor: getColorForPercentage(getPercentageSpent(totalSpent, totalBudget))
                    }]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {getPercentageSpent(totalSpent, totalBudget).toFixed(1)}% {translations.used || 'used'}
                </Text>
              </View>
            </View>
            
            {/* Category List */}
            <View style={styles.categoryHeaderRow}>
              <Text style={styles.sectionTitle}>{translations.categories || 'Categories'}</Text>
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={loadBudgetCategories}
              >
                <Ionicons name="refresh" size={20} color="#A8C3D1" />
              </TouchableOpacity>
            </View>
            
            {categories.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>{translations.emptyStateText || 'No budget categories found. Add your first category!'}</Text>
              </View>
            ) : (
              categories.map((category) => {
                const percentageSpent = getPercentageSpent(category.spent, category.budget);
                return (
                  <View key={category.id} style={styles.categoryCard}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categoryAmount}>
                        ₹ {category.spent.toLocaleString()} / ₹ {category.budget.toLocaleString()}
                      </Text>
                    </View>
                    
                    <View style={styles.progressBarBackground}>
                      <View 
                        style={[styles.progressBarFill, { 
                          width: `${percentageSpent}%`,
                          backgroundColor: getColorForPercentage(percentageSpent)
                        }]}
                      />
                    </View>
                    
                    <View style={styles.categoryFooter}>
                      <Text style={styles.categoryPercentage}>
                        {percentageSpent.toFixed(1)}%
                      </Text>
                      
                      <View style={styles.categoryActions}>
                        <TouchableOpacity 
                          style={styles.categoryActionButton}
                          onPress={() => openAddTransactionModal(category)}
                        >
                          <MaterialIcons name="add-shopping-cart" size={20} color="#A8C3D1" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.categoryActionButton}
                          onPress={() => openEditCategoryModal(category)}
                        >
                          <MaterialIcons name="edit" size={20} color="#A8C3D1" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.categoryActionButton}
                          onPress={() => handleDeleteCategory(category.id)}
                        >
                          <MaterialIcons name="delete" size={20} color="#F44336" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
            
            <TouchableOpacity 
              style={styles.addCategoryButton}
              onPress={() => setAddCategoryModalVisible(true)}
            >
              <AntDesign name="plus" size={20} color="#1A213B" />
              <Text style={styles.addCategoryText}>{translations.addCategory || 'Add Category'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      
      {/* Add Category Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addCategoryModalVisible}
        onRequestClose={() => setAddCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{translations.addCategory || 'Add Category'}</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder={translations.categoryNamePlaceholder || "Category Name"}
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder={translations.budgetAmountPlaceholder || "Budget Amount"}
              placeholderTextColor="rgba(255,255,255,0.5)"
              keyboardType="numeric"
              value={newCategoryBudget}
              onChangeText={setNewCategoryBudget}
            />
            
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setNewCategoryName('');
                  setNewCategoryBudget('');
                  setAddCategoryModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>{translations.modalCancelButtonText || 'Cancel'}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handleAddCategory}
              >
                <Text style={styles.modalSaveButtonText}>{translations.modalSaveButtonText || 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Edit Category Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editCategoryModalVisible}
        onRequestClose={() => setEditCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{translations.editCategory || 'Edit Category'}</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder={translations.categoryNamePlaceholder || "Category Name"}
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder={translations.budgetAmountPlaceholder || "Budget Amount"}
              placeholderTextColor="rgba(255,255,255,0.5)"
              keyboardType="numeric"
              value={newCategoryBudget}
              onChangeText={setNewCategoryBudget}
            />
            
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setNewCategoryName('');
                  setNewCategoryBudget('');
                  setSelectedCategory(null);
                  setEditCategoryModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>{translations.modalCancelButtonText || 'Cancel'}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handleUpdateCategory}
              >
                <Text style={styles.modalSaveButtonText}>{translations.modalSaveButtonText || 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Add Transaction Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addTransactionModalVisible}
        onRequestClose={() => setAddTransactionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {translations.addTransaction || 'Add Transaction'}
              {selectedCategory ? ` - ${selectedCategory.name}` : ''}
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder={translations.transactionDescriptionPlaceholder || "Description"}
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={transactionDescription}
              onChangeText={setTransactionDescription}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder={translations.transactionAmountPlaceholder || "Amount"}
              placeholderTextColor="rgba(255,255,255,0.5)"
              keyboardType="numeric"
              value={transactionAmount}
              onChangeText={setTransactionAmount}
            />
            
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setTransactionDescription('');
                  setTransactionAmount('');
                  setSelectedCategory(null);
                  setAddTransactionModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>{translations.modalCancelButtonText || 'Cancel'}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handleAddTransaction}
              >
                <Text style={styles.modalSaveButtonText}>{translations.modalSaveButtonText || 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A213B',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1A213B',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flexShrink: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#A8C3D1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#1A213B',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A8C3D1',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: 'white',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A8C3D1',
  },
  overallProgressContainer: {
    marginTop: 15,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'right',
    marginTop: 5,
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A8C3D1',
  },
  refreshButton: {
    padding: 5,
  },
  emptyStateContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryAmount: {
    fontSize: 16,
    color: '#A8C3D1',
  },
  categoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  categoryPercentage: {
    fontSize: 14,
    color: 'white',
  },
  categoryActions: {
    flexDirection: 'row',
  },
  categoryActionButton: {
    padding: 5,
    marginLeft: 10,
  },
  addCategoryButton: {
    flexDirection: 'row',
    backgroundColor: '#A8C3D1',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  addCategoryText: {
    color: '#1A213B',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1A213B',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#A8C3D1',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A8C3D1',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    color: 'white',
    fontSize: 16,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 10,
  },
  modalSaveButton: {
    backgroundColor: '#A8C3D1',
    marginLeft: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalSaveButtonText: {
    color: '#1A213B',
    fontWeight: 'bold',
    fontSize: 16,
  },
});