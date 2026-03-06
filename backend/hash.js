import bcrypt from "bcryptjs";

const run = async () => {
  const hash = await bcrypt.hash("admin123", 10);
  console.log(hash);
};

run();


//perintah di dalam back end untuk hash sandi node hash.js
//hasil => $2b$10$X.8HgwiljzkN/ci2XlVsWeixAvJFhXHwzvCkKxHSTTxYBAjFkKsfi