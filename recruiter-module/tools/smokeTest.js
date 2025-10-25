(async () => {
  const base = 'http://localhost:4000/api';
  try {
    const now = Date.now();
    const email = `smoketest+${now}@example.com`;
    const username = `smoketest${now}`;

    console.log('Signing up user', email);
    let res = await fetch(`${base}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Smoke Tester', email, username, password: 'Password123!' })
    });
    const signup = await res.text();
    console.log('signup status', res.status, signup);

    console.log('Logging in');
    res = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: email, password: 'Password123!' })
    });
    const login = await res.json();
    if (!login.token) {
      console.error('Login failed', login);
      process.exit(1);
    }
    console.log('Login success, token received');

    const token = login.token;
    const jobPayload = {
      title: 'Smoke Test Job',
      location: 'Remote',
      jobType: 'Full-time',
      workMode: 'Remote',
      description: '<p>This is a smoke test job</p>',
      tags: ['smoke','test'],
    };

    console.log('Creating job draft');
    res = await fetch(`${base}/jobs/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(jobPayload)
    });
    const job = await res.json();
    console.log('Job created:', job._id);

    console.log('Publishing job');
    res = await fetch(`${base}/jobs/publish/${job._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    const pub = await res.json();
    console.log('Published:', pub.status);

    console.log('Fetching job list');
    res = await fetch(`${base}/jobs`, { headers: { 'Authorization': `Bearer ${token}` }});
    const list = await res.json();
    console.log('Jobs count for user:', list.length);

    console.log('Smoke test completed successfully');
  } catch (err) {
    console.error('Smoke test failed', err);
    process.exit(1);
  }
})();
