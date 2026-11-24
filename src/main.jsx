import { createRoot } from 'react-dom/client';
import InvitationArc from './InvitationArc.jsx';
import HeroSlideshow from './HeroSlideshow.jsx';
import ButterflyField from './ButterflyField.jsx';
import './tailwind.css';

createRoot(document.getElementById('invitation-carousel')).render(<InvitationArc />);
createRoot(document.getElementById('hero-slideshow')).render(<HeroSlideshow />);
createRoot(document.getElementById('butterfly-field-root')).render(<ButterflyField />);
