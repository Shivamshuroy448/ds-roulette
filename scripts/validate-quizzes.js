// Validates quiz answer keys and option bounds
import { TOPICS } from '../src/data/topics.js';

TOPICS.forEach(t => {
  (t.quizzes || []).forEach((q, idx) => {
    if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      console.error(`Invalid correctIndex in ${t.title} Q${idx + 1}`);
    }
  });
});
console.log('Quiz validation complete.');
