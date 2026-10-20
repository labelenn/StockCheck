import type { Category } from '../types';

/**
 * Hard-coded household essentials, grouped by category.
 * Edit freely — add/remove/rename categories or items. Item identity for
 * persistence is derived from `categoryId + item name` (see makeItemKey in
 * src/types.ts), so renaming an item will reset its checked state, but
 * reordering items/categories will not.
 *
 * Each category's icon and accent color are looked up by `id` in
 * src/lib/categoryStyles.tsx — add an entry there if you add a new category.
 */
export const categories: Category[] = [
  {
    id: 'pantry',
    name: 'Pantry',
    items: [
      'Rice',
      'Cooking oil',
      'Coconut milk',
      'Tomato sauce',
      'Flour',
      'Sugar',
      'Coffee',
      'Ketchup',
      'Mang Tomas',
      'Soy sauce',
      'Vinegar',
      'Salt',
      'Pepper',
      'Pork/Chicken/Beef cubes',
      'Sinigang mix',
    ],
  },
  {
    id: 'fruit-vegetables',
    name: 'Fruit & Vegetables',
    items: [
      'Bananas',
      'Oranges',
      'Onions',
      'Garlic',
      'Tomatoes',
      'Potatoes',
      'Red Chilli',
      'Green Chilli',
    ],
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    items: ['Milk', 'Eggs', 'Butter', 'Cheese', 'Mayonnaise'],
  },
  {
    id: 'kitchen-supplies',
    name: 'Kitchen Supplies',
    items: ['Cling roll', 'Aluminium foil', 'Baking paper', 'Zip-lock bags'],
  },
  {
    id: 'household-cleaning',
    name: 'Household Cleaning',
    items: [
      'Dishwashing liquid',
      'Dishwasher tablets',
      'Sponges',
      'Bin bags',
      'Paper towels',
      'Glass cleaner',
    ],
  },
  {
    id: 'laundry',
    name: 'Laundry',
    items: ['Laundry detergent', 'Fabric softener'],
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    items: ['Shampoo', 'Toothpaste', 'Bar soap', 'Cotton buds', 'Toilet paper'],
  },
];
