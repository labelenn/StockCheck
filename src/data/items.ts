import type { Category } from '../types';

/**
 * Hard-coded household essentials, grouped by category.
 * Edit freely — add/remove/rename categories or items. Item identity for
 * persistence is derived from `categoryId + item name` (see makeItemKey in
 * src/types.ts), so renaming an item will reset its checked state, but
 * reordering items/categories will not.
 *
 * Category order is the walk-through-the-house order used by the check
 * wizard (src/components/CheckScreen.tsx) — reordering here changes that flow.
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
      'Bread',
      'Cooking oil',
      'Sugar',
      'Coffee',
      'Ketchup',
      'Soy sauce',
      'Vinegar',
      'Salt',
      'Pepper',
      'Pork/Chicken/Beef cubes',
      'Pasta',
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
      'Ginger',
      'Tomatoes',
      'Potatoes',
      'Red Chilli',
      'Green Chilli',
      'Cucumber',
      'Carrots',
      'Broccoli',
    ],
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    items: ['Milk', 'Eggs', 'Butter', 'Cheese', 'Mayonnaise'],
  },
  {
    id: 'freezer',
    name: 'Freezer',
    items: ['Pork', 'Chicken', 'Beef', 'Fish'],
  },
  {
    id: 'kitchen-supplies',
    name: 'Kitchen Supplies',
    items: ['Cling roll', 'Aluminium foil', 'Baking paper', 'Zip-lock bags', 'Garbage bags'],
  },
  {
    id: 'household-cleaning',
    name: 'Household Cleaning',
    items: [
      'Dishwashing liquid',
      'Dishwasher tablets',
      'Sponges',
      'Paper towels',
      'Glass cleaner',
      'All-purpose cleaner',
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
    items: ['Shampoo', 'Toothpaste', 'Bar soap', 'Toilet paper', 'Hand soap', 'Razor'],
  },
];
