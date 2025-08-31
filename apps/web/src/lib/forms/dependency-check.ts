// Dependency check to ensure all required packages are available

import { useForm } from '@tanstack/react-form'
import { motion } from 'framer-motion'
import { z } from 'zod'

// This file verifies that all required dependencies are properly installed
// and can be imported without errors

export const dependencyCheck = {
  zod: z,
  tanstackForm: useForm,
  framerMotion: motion,
  status: 'All dependencies available' as const,
}
