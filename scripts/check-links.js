// Check deep research links
import { TOPICS } from '../src/data/topics.js';

const urls = TOPICS.map(t => t.deepResearch?.url).filter(Boolean);
console.log(`Identified ${urls.length} deep research links.`);
