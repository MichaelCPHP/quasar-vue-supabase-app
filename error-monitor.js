#!/usr/bin/env node

import { spawn } from 'child_process';
import { watch } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ErrorMonitor {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.isMonitoring = false;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      error: '\x1b[31m', // Red
      warn: '\x1b[33m',  // Yellow
      info: '\x1b[36m',  // Cyan
      success: '\x1b[32m' // Green
    };
    const reset = '\x1b[0m';
    
    console.log(`${colors[type]}[${timestamp}] ${type.toUpperCase()}: ${message}${reset}`);
  }

  trackError(error, source) {
    const errorObj = {
      timestamp: new Date().toISOString(),
      source,
      message: error.message || error,
      stack: error.stack || '',
      id: Date.now()
    };
    
    this.errors.push(errorObj);
    this.log(`ERROR in ${source}: ${errorObj.message}`, 'error');
    
    // Keep only last 50 errors to prevent memory issues
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50);
    }
  }

  trackWarning(warning, source) {
    const warningObj = {
      timestamp: new Date().toISOString(),
      source,
      message: warning.message || warning,
      id: Date.now()
    };
    
    this.warnings.push(warningObj);
    this.log(`WARNING in ${source}: ${warningObj.message}`, 'warn');
    
    // Keep only last 50 warnings
    if (this.warnings.length > 50) {
      this.warnings = this.warnings.slice(-50);
    }
  }

  runESLint() {
    this.log('Running ESLint check...', 'info');
    
    const eslint = spawn('npm', ['run', 'lint'], {
      stdio: 'pipe',
      shell: true
    });

    eslint.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('error') || output.includes('Error')) {
        this.trackError(output, 'ESLint');
      } else if (output.includes('warning') || output.includes('Warning')) {
        this.trackWarning(output, 'ESLint');
      } else if (output.trim()) {
        this.log(`ESLint: ${output.trim()}`, 'info');
      }
    });

    eslint.stderr.on('data', (data) => {
      this.trackError(data.toString(), 'ESLint');
    });

    eslint.on('close', (code) => {
      if (code === 0) {
        this.log('ESLint check completed successfully', 'success');
      } else {
        this.log(`ESLint check failed with exit code ${code}`, 'error');
      }
    });
  }

  startDevServer() {
    this.log('Starting Quasar development server...', 'info');
    
    const devServer = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      shell: true
    });

    devServer.stdout.on('data', (data) => {
      const output = data.toString();
      
      // Parse different types of errors/warnings
      if (output.includes('[ERROR]') || output.includes('ERROR:')) {
        this.trackError(output, 'Dev Server');
      } else if (output.includes('[WARN]') || output.includes('WARNING:')) {
        this.trackWarning(output, 'Dev Server');
      } else if (output.includes('Error:') || output.includes('error:')) {
        this.trackError(output, 'Dev Server');
      } else if (output.includes('Failed to compile')) {
        this.trackError(output, 'Compilation');
      } else if (output.includes('compiled with warnings')) {
        this.trackWarning(output, 'Compilation');
      } else if (output.includes('✓') || output.includes('ready')) {
        this.log(`Dev Server: ${output.trim()}`, 'success');
      } else if (output.trim()) {
        this.log(`Dev Server: ${output.trim()}`, 'info');
      }
    });

    devServer.stderr.on('data', (data) => {
      const output = data.toString();
      if (output.includes('EADDRINUSE')) {
        this.trackError('Port already in use. Please stop other instances or use a different port.', 'Dev Server');
      } else {
        this.trackError(output, 'Dev Server');
      }
    });

    devServer.on('close', (code) => {
      if (code !== 0) {
        this.trackError(`Development server exited with code ${code}`, 'Dev Server');
      }
    });

    return devServer;
  }

  watchFiles() {
    this.log('Setting up file watchers...', 'info');
    
    const watchPaths = [
      './src',
      './src-pwa',
      './src-capacitor',
      './quasar.config.js',
      './package.json'
    ];

    watchPaths.forEach(path => {
      try {
        watch(resolve(__dirname, path), { recursive: true }, (eventType, filename) => {
          if (filename && (filename.endsWith('.vue') || filename.endsWith('.js') || filename.endsWith('.ts'))) {
            this.log(`File changed: ${filename}`, 'info');
            // Run ESLint on file changes
            setTimeout(() => this.runESLint(), 1000);
          }
        });
        this.log(`Watching: ${path}`, 'info');
      } catch (error) {
        this.log(`Failed to watch ${path}: ${error.message}`, 'warn');
      }
    });
  }

  getSummary() {
    return {
      errors: this.errors.length,
      warnings: this.warnings.length,
      recentErrors: this.errors.slice(-5),
      recentWarnings: this.warnings.slice(-5)
    };
  }

  printSummary() {
    const summary = this.getSummary();
    console.log('\n' + '='.repeat(60));
    console.log('ERROR MONITORING SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Errors: ${summary.errors}`);
    console.log(`Total Warnings: ${summary.warnings}`);
    
    if (summary.recentErrors.length > 0) {
      console.log('\nRecent Errors:');
      summary.recentErrors.forEach(error => {
        console.log(`  - [${error.source}] ${error.message.substring(0, 100)}...`);
      });
    }
    
    if (summary.recentWarnings.length > 0) {
      console.log('\nRecent Warnings:');
      summary.recentWarnings.forEach(warning => {
        console.log(`  - [${warning.source}] ${warning.message.substring(0, 100)}...`);
      });
    }
    console.log('='.repeat(60) + '\n');
  }

  start() {
    this.log('Starting comprehensive error monitoring for Quasar project...', 'info');
    this.isMonitoring = true;

    // Initial ESLint check
    this.runESLint();

    // Start development server
    const devServer = this.startDevServer();

    // Set up file watchers
    this.watchFiles();

    // Print summary every 30 seconds
    setInterval(() => {
      if (this.errors.length > 0 || this.warnings.length > 0) {
        this.printSummary();
      }
    }, 30000);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      this.log('Shutting down error monitor...', 'info');
      this.printSummary();
      devServer.kill();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      this.log('Shutting down error monitor...', 'info');
      this.printSummary();
      devServer.kill();
      process.exit(0);
    });
  }
}

// Start monitoring if this script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new ErrorMonitor();
  monitor.start();
}

export default ErrorMonitor;