/**
 * The MIT License (MIT)
 * Copyright (c) 2015-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

import LexGrammar from '../lex-grammar';
import {EOF} from '../../special-symbols';

const lexGrammarData = require(__dirname + '/calc.lex');
const lexGrammar = new LexGrammar(lexGrammarData);

const rulesToIndices = rules => {
  return rules.map(rule => lexGrammar.getRuleIndex(rule));
};

const startConditions = {
  INITIAL: 0,
  comment: 1,
};

const lexRulesByStartConditions = {
  INITIAL: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  comment: [0, 1, 9, 10, 11],
};

describe('lex-grammar', () => {

  it('rules', () => {
    const rulesData = lexGrammar.getRules().map(rule => rule.toData());
    expect(rulesData).toEqual(lexGrammarData.rules);
    expect(rulesData).toEqual(lexGrammar.getOriginalRules());
  });

  it('rule by index', () => {
    const firstRule = lexGrammar.getRuleByIndex(0);
    expect(firstRule).toBe(lexGrammar.getRules()[0]);
  });

  it('index of a rule', () => {
    const firstRule = lexGrammar.getRuleByIndex(0);
    expect(lexGrammar.getRuleIndex(firstRule)).toBe(0);
  });

  it('start conditions', () => {
    expect(lexGrammar.getStartConditions()).toEqual(startConditions);
  });

  it('macros', () => {
    expect(lexGrammar.getMacros()).toEqual(lexGrammarData.macros);
  });

  it('expanded macro', () => {
    const rule3 = lexGrammar.getRuleByIndex(3);
    const id = lexGrammarData.macros.id;

    expect(rule3.getMatcher().source).toEqual(`^${id}+`);
    expect(rule3.getOriginalMatcher()).toEqual(`${id}+`);
    expect(rule3.getRawMatcher()).toEqual(`^${id}+`);

    // Macro in a rule with a start condition.
    const rule11 = lexGrammar.getRuleByIndex(11);
    expect(rule11.getOriginalMatcher()).toEqual(`${id}+`);

    // Standard macro.
    const rule1 = lexGrammar.getRuleByIndex(1);
    // <<EOF>> -> $
    expect(rule1.getOriginalMatcher()).toEqual(EOF);
  });

  it('rules by start conditions', () => {
    const rulesByStartConditions = lexGrammar.getRulesByStartConditions();
    const rulesByConditionsData = {};

    Object.keys(rulesByStartConditions).forEach(startCondition => {
      const rules = rulesByStartConditions[startCondition];
      rulesByConditionsData[startCondition] = rulesToIndices(rules);
    });

    expect(rulesByConditionsData).toEqual(lexRulesByStartConditions);
  });

  it('rules for start conditions', () => {
    const rulesByStartConditions = lexGrammar.getRulesByStartConditions();

    Object.keys(rulesByStartConditions).forEach(startCondition => {
      const expectedLexRules = lexRulesByStartConditions[startCondition];

      const rules = rulesToIndices(lexGrammar.getRulesForState(startCondition));
      expect(rules).toEqual(expectedLexRules);
    });
  });

  it('options', () => {
    const options = lexGrammarData.options;

    expect(lexGrammar.getOptions()).toEqual(options);
    expect(lexGrammar.getRuleByIndex(0).getOptions()).toEqual(options);
  });

});