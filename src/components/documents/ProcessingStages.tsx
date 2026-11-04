'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { ProcessingStage } from '@/types';

interface ProcessingStagesProps {
  stages: ProcessingStage[];
  currentStage: string;
}

const DEFAULT_STAGES: ProcessingStage[] = [
  { id: 'reading', label: 'Reading document', status: 'pending' },
  { id: 'extracting', label: 'Extracting concepts', status: 'pending' },
  { id: 'understanding', label: 'Understanding context', status: 'pending' },
  { id: 'translation', label: 'Preparing translation', status: 'pending' },
  { id: 'resources', label: 'Generating resources', status: 'pending' },
];

function getStageStatus(
  stage: ProcessingStage,
  stages: ProcessingStage[],
  currentStage: string,
): 'completed' | 'active' | 'pending' {
  const currentIndex = stages.findIndex((s) => s.id === currentStage);
  const stageIndex = stages.findIndex((s) => s.id === stage.id);
  if (stageIndex < currentIndex) return 'completed';
  if (stageIndex === currentIndex) return 'active';
  return 'pending';
}

export default function ProcessingStages({ stages, currentStage }: ProcessingStagesProps) {
  const displayStages = stages.length > 0 ? stages : DEFAULT_STAGES;

  return (
    <div className="w-full max-w-sm mx-auto py-4">
      <ul className="space-y-3">
        <AnimatePresence initial={false}>
          {displayStages.map((stage, index) => {
            const status = getStageStatus(stage, displayStages, currentStage);

            return (
              <motion.li
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                className="flex items-center gap-4"
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
                    status === 'completed' && 'bg-coral',
                    status === 'active' && 'bg-editorial-blue/15 ring-2 ring-editorial-blue',
                    status === 'pending' && 'bg-black/5',
                  )}
                >
                  {status === 'completed' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                  {status === 'active' && (
                    <Loader2 size={16} className="text-editorial-blue animate-spin" />
                  )}
                  {status === 'pending' && (
                    <span className="w-2 h-2 rounded-full bg-black/20" />
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <span
                    className={cn(
                      'text-sm font-medium transition-colors duration-300',
                      status === 'completed' && 'text-ink line-through decoration-coral/50',
                      status === 'active' && 'text-ink',
                      status === 'pending' && 'text-ink/35',
                    )}
                  >
                    {stage.label}
                  </span>
                  {status === 'active' && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
                      className="h-0.5 bg-gradient-to-r from-editorial-blue to-coral rounded-full mt-1"
                    />
                  )}
                </div>

                {/* Status badge */}
                {status === 'completed' && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-semibold text-coral"
                  >
                    Done
                  </motion.span>
                )}
                {status === 'active' && (
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xs font-semibold text-editorial-blue"
                  >
                    Running
                  </motion.span>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
