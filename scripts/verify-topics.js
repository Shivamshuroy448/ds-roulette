// Verify that all topics adhere to schema requirements
import { TOPICS, CATEGORIES } from '../src/data/topics.js';

console.log(`Checking ${TOPICS.length} topics...`);
let errors = 0;

TOPICS.forEach((t, i) => {
  if (!t.title) { console.error(`Topic ${i} missing title`); errors++; }
  if (!t.category || !CATEGORIES[t.category]) { console.error(`Topic ${t.title} invalid category`); errors++; }
  if (!t.quizzes || t.quizzes.length === 0) { console.error(`Topic ${t.title} missing quizzes`); errors++; }
});

if (errors === 0) {
  console.log('All topics verified successfully!');
} else {
  console.error(`Verification failed with ${errors} errors.`);
  process.exit(1);
}
