const fs = require('fs');
let code = fs.readFileSync('src/components/PeriodHub.tsx', 'utf8');

// Replace imports
code = code.replace(/import React, \{ useState, useEffect, useRef, Suspense, lazy \} from 'react';/, "import React, { useState, useEffect, useRef } from 'react';");

code = code.replace(/const (\w+) = lazy\(\(\) => import\('\.\/([A-Za-z0-9]+)'\)\.then\(m => \(\{ default: m\.\1 \}\)\)\);/g, "import { $1 } from './$2';");

// Remove <Suspense fallback={...}> and </Suspense>
code = code.replace(/<Suspense fallback=\{<div className="h-40 w-full flex items-center justify-center text-pink-300\/50 animate-pulse text-\[10px\] uppercase tracking-widest font-bold">Waking up components\.\.\. 🌸<\/div>\}>/g, "");
code = code.replace(/<\/Suspense>/g, "");

fs.writeFileSync('src/components/PeriodHub.tsx', code);
