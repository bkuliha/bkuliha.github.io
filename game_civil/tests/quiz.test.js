'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const questions = require('../questions.js');
const { shuffle, makeQuiz } = require('../engine.js');
const topics = ['civil', 'aid', 'orientation', 'nature'];
// Repeatable pseudo-random stream makes failures reproducible.
function random(seed) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
}
test('360 valid questions, 40 distinct prompts per grade and 10 per topic', () => {
  assert.equal(questions.length, 360);
  assert.equal(new Set(questions.map(q => q.id)).size, 360);
  for (let grade = 1; grade <= 9; grade++) {
    const bank = questions.filter(q => q.grade === grade);
    assert.equal(bank.length, 40);
    assert.equal(new Set(bank.map(q => q.question)).size, 40);
    assert.equal(bank.filter(q => q.visual === 'map').length, 1);
    for (const topic of topics) assert.equal(bank.filter(q => q.topic === topic).length, 10);
    for (const q of bank) {
      assert.ok(q.question.length > 10 && q.explanation.length > 20, q.id);
      assert.equal(q.answers.length, 3, q.id);
      assert.equal(new Set(q.answers).size, 3, q.id);
      assert.ok(q.answers.every(answer => answer.trim().length > 0), q.id);
    }
  }
});
test('each of 900 quizzes has 12 unique questions, three per topic, with no consecutive repeats', () => {
  const before = JSON.stringify(questions);
  for (let grade = 1; grade <= 9; grade++) {
    const rng = random(grade);
    let previous = [];
    const seen = new Set();
    const answerPositions = new Set();
    const firstTopics = new Set();
    for (let run = 0; run < 100; run++) {
      const quiz = makeQuiz(questions, grade, previous, rng);
      assert.equal(quiz.length, 12);
      assert.equal(new Set(quiz.map(q => q.id)).size, 12);
      firstTopics.add(quiz[0].topic);
      for (const topic of topics) assert.equal(quiz.filter(q => q.topic === topic).length, 3);
      for (const q of quiz) {
        assert.equal(q.grade, grade);
        assert.ok(!previous.includes(q.id));
        assert.equal(q.answers.filter(answer => answer.correct).length, 1);
        const original = questions.find(item => item.id === q.id);
        assert.equal(q.answers.find(answer => answer.correct).text, original.answers[0]);
        assert.deepEqual(q.answers.map(answer => answer.text).sort(), [...original.answers].sort());
        seen.add(q.id); answerPositions.add(q.answers.findIndex(answer => answer.correct));
      }
      previous = quiz.map(q => q.id);
    }
    assert.equal(seen.size, 40, `coverage for grade ${grade}`);
    assert.equal(answerPositions.size, 3, `answer positions for grade ${grade}`);
    assert.equal(firstTopics.size, 4, `question order for grade ${grade}`);
  }
  assert.equal(JSON.stringify(questions), before, 'bank must remain unchanged');
});
test('shuffle works on a copy and handles empty input', () => {
  const input = [1, 2, 3, 4];
  const result = shuffle(input, random(42));
  assert.notEqual(result, input);
  assert.deepEqual(input, [1, 2, 3, 4]);
  assert.deepEqual([...result].sort(), input);
  assert.deepEqual(shuffle([]), []);
});
