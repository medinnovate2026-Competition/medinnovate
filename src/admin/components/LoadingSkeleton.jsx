import { motion } from "framer-motion";

function LoadingSkeleton({ rows = 4 }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, index) => (
        <motion.div
          key={index}
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.1 }}
          className="h-14 rounded-2xl bg-gradient-to-r from-violet-100 via-white to-violet-100"
        />
      ))}
    </div>
  );
}

export default LoadingSkeleton;
