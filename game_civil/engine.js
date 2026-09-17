/* Shared, DOM-independent quiz logic. Also used by the automated tests. */
(function (root) {
  'use strict';
  function shuffle(items, random = Math.random) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function makeQuiz(bank, grade, previousIds = [], random = Math.random) {
    const previous = new Set(previousIds);
    const chosen = ['civil', 'aid', 'orientation', 'nature'].flatMap(topic => {
      const pool = bank.filter(q => q.grade === grade && q.topic === topic);
      const fresh = pool.filter(q => !previous.has(q.id));
      return shuffle(fresh.length >= 3 ? fresh : pool, random).slice(0, 3);
    });
    return shuffle(chosen, random).map(question => ({
      ...question,
      answers: shuffle(question.answers.map((text, i) => ({ text, correct: i === 0 })), random)
    }));
  }
  const api = { shuffle, makeQuiz };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.QuizEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
