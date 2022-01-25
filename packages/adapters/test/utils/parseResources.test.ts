import { adapters } from '../../src';
import { parseResources } from '../../src/utils/parseResources';

it('should parse resources', () => {
    const result = parseResources({
        adapter: adapters.fluent,
        files: [
            {
                languageCode: 'en',
                data: 'test = this is my test\nhello = hello there\ncomplex = Hello {$name}\nextra = a key without translations',
            },
            { languageCode: 'da', data: 'test = dette er min test\nhello = hej med dig\ncomplex = Hej {$name}' },
            { languageCode: 'de', data: 'test = dis ist ein test\nhello = hallo mit dich\ncomplex = Hallo {$name}' },
        ],
    });
    expect(result.isOk).toBeTruthy();
});

it('should return Result.err if parsing went wrong', () => {
    const result = parseResources({
        adapter: adapters.fluent,
        files: [{ languageCode: 'aa', data: 'ianfsgsin {}{{{' }],
    });
    expect(result.isErr).toBeTruthy();
});
