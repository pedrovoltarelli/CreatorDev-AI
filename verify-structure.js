// Verification script to check the project structure
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'app/page.tsx',
  'app/(auth)/login/page.tsx',
  'app/(auth)/register/page.tsx',
  'app/dashboard/page.tsx',
  'app/dashboard/generate/page.tsx',
  'app/dashboard/history/page.tsx',
  'app/dashboard/settings/page.tsx',
  'app/api/generate/route.ts',
  'components/Navigation.tsx',
  'components/ThemeToggle.tsx',
  'lib/constants.ts',
  'lib/utils.ts',
  'README.md',
  'next.config.ts',
  'package.json',
  'tsconfig.json',
];

const requiredDirectories = [
  'app/(auth)',
  'app/dashboard',
  'app/dashboard/generate',
  'app/dashboard/history',
  'app/dashboard/settings',
  'app/api',
  'components',
  'lib',
  'styles',
];

console.log('\n🔍 Verifying CreatorDev AI Project Structure\n');

let allGood = true;

// Check directories
console.log('📁 Required Directories:');
requiredDirectories.forEach(dir => {
  const exists = fs.existsSync(dir);
  console.log(`  ${exists ? '✅' : '❌'} ${dir}`);
  if (!exists) allGood = false;
});

console.log('\n📄 Required Files:');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allGood = false;
});

console.log('\n⚙️  Configuration Files:');
const configFiles = ['.env.local.example', 'README.md'];
configFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allGood = false;
});

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ All required files and directories are present!');
  console.log('\n🎉 CreatorDev AI is ready to launch!');
  process.exit(0);
} else {
  console.log('❌ Some required files are missing.');
  process.exit(1);
}

console.log('='.repeat(50));