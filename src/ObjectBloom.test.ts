import { ObjectBloom } from './ObjectBloom';

describe('ObjectBloom', () => {
  const bloom = new ObjectBloom({
    ngramSize: 3,
    bloomBits: 16,
    hashFunctions: 2,
    fields: ['full_name', 'phone_number', 'tags']
  });

  it('extracts text from object fields and generates a Bloom filter', () => {
    const obj = {
      full_name: 'John Doe',
      phone_number: '1234567890',
      tags: ['vip', 'lead']
    };
    // @ts-ignore
    const text = bloom['extractText'](obj);
    expect(text).toContain('John Doe');
    expect(text).toContain('1234567890');
    expect(text).toContain('vip');
    expect(text).toContain('lead');

    const map = bloom.bloomFromObject(obj);
    expect(typeof map).toBe('object');
    expect(Object.values(map).every(v => v === 1)).toBe(true);
  });
});