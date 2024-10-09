import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// after each test, afterEach
// is executed and resets jsdom
afterEach(() => {
  cleanup()
})