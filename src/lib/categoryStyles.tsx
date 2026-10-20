import type { SvgIconComponent } from '@mui/icons-material';
import BathtubIcon from '@mui/icons-material/Bathtub';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import KitchenIcon from '@mui/icons-material/Kitchen';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SoapIcon from '@mui/icons-material/Soap';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import CategoryIcon from '@mui/icons-material/Category';

/** Per-category icon + a soft pastel accent color (hex), keyed by category id. */
interface CategoryStyle {
  Icon: SvgIconComponent;
  accent: string;
}

const styles: Record<string, CategoryStyle> = {
  bathroom: { Icon: BathtubIcon, accent: '#8ED3CE' }, // soft teal
  laundry: { Icon: LocalLaundryServiceIcon, accent: '#A7AEE8' }, // soft periwinkle
  pantry: { Icon: Inventory2Icon, accent: '#F2C572' }, // soft honey
  'fruit-vegetables': { Icon: LocalFloristIcon, accent: '#A8D277' }, // soft leaf green
  refrigerator: { Icon: KitchenIcon, accent: '#8EC5E8' }, // soft sky blue
  freezer: { Icon: AcUnitIcon, accent: '#A7D8E8' }, // soft ice blue
  'household-cleaning': { Icon: CleaningServicesIcon, accent: '#9AD0B0' }, // soft sage
  toiletries: { Icon: SoapIcon, accent: '#F0A8C0' }, // soft rose
  'kitchen-supplies': { Icon: RestaurantIcon, accent: '#F2B480' }, // soft peach
  other: { Icon: CategoryIcon, accent: '#C3BCDA' }, // soft lavender gray
};

const fallback: CategoryStyle = styles.other;

export function getCategoryStyle(categoryId: string): CategoryStyle {
  return styles[categoryId] ?? fallback;
}
