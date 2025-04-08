import * as bcrypt from 'bcryptjs';

async function test() {
  const plain = 'password';
  const hashed = await bcrypt.hash(plain, 10);
  const isMatch = await bcrypt.compare('password', hashed);
  console.log('Does it match?', isMatch); // Should say true
}

test();