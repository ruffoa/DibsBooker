import * as assert from 'assert';
import {getDateFromIntDayTime, getDaysFromToday, getPrettyDay} from '../../src/lib/dateFuncs';
import sinon from 'sinon';

const sandbox = sinon.createSandbox();

describe('Get Days From Today', () => {

  beforeEach(() => {
    sandbox.useFakeTimers({
      toFake: ['setTimeout']
    });
  });

  afterEach(() => {
    // Restore the default sandbox here
    sinon.restore();
  });

  it('returns the correct diff between two dates within the same calendar day', () => {
    const timeToFake = new Date();
    timeToFake.setHours(13, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = new Date();
    dayToSend.setHours(12, 29,49);
    const result = getDaysFromToday(dayToSend);
    assert.strictEqual(result, 0, `Expected to see that the difference is days, but got ${result} days instead`);
  });

  it('returns the correct diff between two dates within the same calendar day, even if the passed in date is later than the "current time"', () => {
    const timeToFake = new Date();
    timeToFake.setHours(13, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = new Date();
    dayToSend.setHours(23, 58,49);
    const result = getDaysFromToday(dayToSend);
    assert.strictEqual(result, 0, `Expected to see that the difference is 0 days, but got ${result} days instead`);
  });

  it('returns the correct diff between two dates across different calendar days', () => {
    const timeToFake = new Date();
    timeToFake.setHours(13, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = new Date();
    dayToSend.setDate(dayToSend.getDate() + 3);
    const result = getDaysFromToday(dayToSend);
    assert.strictEqual(result, 3, `Expected to see that the difference is 3 days, but got ${result} days instead`);
  });

  it('returns the correct negative diff between two dates across different calendar days', () => {
    const timeToFake = new Date();
    timeToFake.setHours(13, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = new Date();
    dayToSend.setDate(dayToSend.getDate() - 3);
    const result = getDaysFromToday(dayToSend);
    assert.strictEqual(result, -3, `Expected to see that the difference is -3 days, but got ${result} days instead`);
  });

  it('returns the correct diff between two dates across different calendar days, even if they are less than 24 hours apart', () => {
    const timeToFake = new Date();
    timeToFake.setHours(23, 59, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = new Date();
    dayToSend.setDate(dayToSend.getDate() + 1);
    dayToSend.setHours(0,10,0,0);
    const result = getDaysFromToday(dayToSend);
    assert.strictEqual(result, 1, `Expected to see that the difference is 1 day, but got ${result} days instead`);
  });

});

describe('Get Pretty Day', () => {

  beforeEach(() => {
    sandbox.useFakeTimers({
      toFake: ['setTimeout']
    });
  });

  afterEach(() => {
    // Restore the default sandbox here
    sinon.restore();
  });

  it('returns "Today" for the current calendar day', () => {
    const timeToFake = new Date();
    timeToFake.setHours(13, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = 0;

    const result = getPrettyDay(dayToSend);
    assert.strictEqual(result, 'Today', `Expected to see Today, but got ${result} instead`);
  });

  it('returns "Today" for the current calendar day, even at the end of the day', () => {
    const timeToFake = new Date();
    timeToFake.setHours(23, 29, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = 0;

    const result = getPrettyDay(dayToSend);
    assert.strictEqual(result, 'Today', `Expected to see Today, but got ${result} instead`);
  });

  it('returns "Today" for the current calendar day, even at the start of the day', () => {
    const timeToFake = new Date();
    timeToFake.setHours(1, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = 0;

    const result = getPrettyDay(dayToSend);
    assert.strictEqual(result, 'Today', `Expected to see Today, but got ${result} instead`);
  });

  it('returns "Tomorrow" for the next calendar day', () => {
    const timeToFake = new Date();
    timeToFake.setHours(13, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = 1;

    const result = getPrettyDay(dayToSend);
    assert.strictEqual(result, 'Tomorrow', `Expected to see Tomorrow, but got ${result} instead`);
  });

  it('returns "Tomorrow" for the current calendar day, even at the start of the day', () => {
    const timeToFake = new Date();
    timeToFake.setHours(0, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = 1;

    const result = getPrettyDay(dayToSend);
    assert.strictEqual(result, 'Tomorrow', `Expected to see Tomorrow, but got ${result} instead`);
  });

  it('returns "Yesterday" for the previous calendar day', () => {
    const timeToFake = new Date();
    timeToFake.setHours(18, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = -1;

    const result = getPrettyDay(dayToSend);
    assert.strictEqual(result, 'Yesterday', `Expected to see Yesterday, but got ${result} instead`);
  });

  it('returns the date object to a readable string for every other day', () => {
    sandbox.useFakeTimers(new Date('2019-01-01T00:00:00Z'));

    const timeToFake = new Date();
    timeToFake.setHours(0, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = 2;

    const result = getPrettyDay(dayToSend);
    assert.strictEqual(result, 'Thursday, January 3, 2019', `Expected to see Thursday, January 3, 2019, but got ${result} instead`);
  });

  it('returns the date object to a readable string even across years', () => {
    sandbox.useFakeTimers(new Date('2019-01-01T00:00:00Z'));

    const timeToFake = new Date();
    timeToFake.setHours(0, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = -2;

    const result = getPrettyDay(dayToSend);
    assert.strictEqual(result, 'Sunday, December 30, 2018', `Expected to see Sunday, December 30, 2018, but got ${result} instead`);
  });

});

describe('getDateFromIntDayTime', () => {

  beforeEach(() => {
    sandbox.useFakeTimers({
      toFake: ['setTimeout']
    });
  });

  afterEach(() => {
    // Restore the default sandbox here
    sinon.restore();
  });

  it('returns a correctly formatted time string', () => {
    sandbox.useFakeTimers(new Date('2019-01-01T00:00:00Z'));

    const timeToFake = new Date();
    timeToFake.setHours(0, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = 1;

    const result = getDateFromIntDayTime(3, 7);
    assert.strictEqual(result, '2019/01/04 7:30:00', `Expected to see "2019/01/04 7:30:00", but got ${result} instead`);
  });

  it('returns a correctly formatted time string if the day is today', () => {
    sandbox.useFakeTimers(new Date('2019-01-01T00:00:00Z'));

    const timeToFake = new Date();
    timeToFake.setHours(0, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = 1;

    const result = getDateFromIntDayTime(0, 7);
    assert.strictEqual(result, '2019/01/01 7:30:00', `Expected to see "2019/01/01 7:30:00", but got ${result} instead`);
  });

  it('returns a correctly formatted time string if the day is tomorrow', () => {
    sandbox.useFakeTimers(new Date('2019-01-01T00:00:00Z'));

    const timeToFake = new Date();
    timeToFake.setHours(0, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = 1;

    const result = getDateFromIntDayTime(1, 7);
    assert.strictEqual(result, '2019/01/02 7:30:00', `Expected to see "2019/01/02 7:30:00", but got ${result} instead`);
  });

  it('returns a correctly formatted time string if the day is over 14 days away', () => {
    sandbox.useFakeTimers(new Date('2019-01-01T00:00:00Z'));

    const timeToFake = new Date();
    timeToFake.setHours(0, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = 1;

    const result = getDateFromIntDayTime(15, 7);
    assert.strictEqual(result, '2019/01/16 7:30:00', `Expected to see "2019/01/16 7:30:00", but got ${result} instead`);
  });

  it('returns a correctly formatted time string if it is almost the end of the day', () => {
    sandbox.useFakeTimers(new Date('2019-01-01T22:00:00Z'));

    const timeToFake = new Date();
    timeToFake.setHours(0, 12, 2);
    sinon.useFakeTimers(timeToFake);

    const dayToSend = 1;

    const result = getDateFromIntDayTime(0, 23);
    assert.strictEqual(result, '2019/01/02 23:30:00', `Expected to see "2019/01/02 23:30:00", but got ${result} instead`);
  });

});