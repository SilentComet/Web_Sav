import redis from './src/utils/redis';

async function check() {
    try {
        await redis.set('test-key', 'hello redis');
        const value = await redis.get('test-key');
        console.log('Retrieved value:', value);

        if (value === 'hello redis') {
            console.log('Redis verification SUCCESS');
        } else {
            console.error('Redis verification FAILED: Value mismatch');
        }

        await redis.del('test-key');

        // Test that utility is exported and connection works
        const info = await redis.info();
        console.log('Redis Info (partial):', info.substring(0, 50));

    } catch (e) {
        console.error('Redis verification ERROR:', e);
    } finally {
        await redis.quit();
    }
}

check();
