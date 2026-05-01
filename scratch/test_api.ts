async function testApi() {
  try {
    const response = await fetch('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      return;
    }

    console.log('Response OK, reading stream...');
    const reader = response.body;
    if (reader) {
      // @ts-ignore
      for await (const chunk of reader) {
        process.stdout.write(chunk.toString());
      }
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testApi();
