import { motion } from "framer-motion";
import { Award, Flame, TrendingUp, Clock, CheckCircle2, Star } from "lucide-react";
import { Button } from "../../../shared/ui";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export const Dashboard = () => {
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-brand-primary/10 via-brand-primary/5 to-transparent p-6 rounded-2xl border border-brand-primary/10">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back, Omkar! 👋</h1>
          <p className="text-text-secondary mt-1">You're on a 5-day streak. Keep it up!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-neutral-surface px-4 py-2 rounded-full border border-neutral-border hover-card-lift">
            <Flame className="text-orange-500" size={20} />
            <span className="font-bold text-text-primary text-lg">5</span>
            <span className="text-text-secondary text-sm font-medium">Days</span>
          </div>
          <Button variant="primary" leftIcon={<CheckCircle2 size={18} />}>Log Daily Action</Button>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-card-bg p-6 rounded-2xl border border-card-border hover-card-lift">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Profile Completion</h3>
            <TrendingUp className="text-brand-primary" size={20} />
          </div>
          <div className="w-full bg-neutral-surface rounded-full h-2.5 mb-2 overflow-hidden shadow-inner">
            <motion.div 
              className="bg-brand-primary h-2.5 rounded-full" 
              initial={{ width: 0 }} 
              animate={{ width: "80%" }} 
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-sm text-text-secondary text-right font-medium">80% Complete</p>
          <div className="mt-4 p-3 bg-info-light dark:bg-info/10 text-info dark:text-info-light rounded-lg text-sm flex items-start gap-2">
            <Star size={16} className="mt-0.5 flex-shrink-0" />
            <span>Add your skills to reach 100% and unlock the "All-Star" badge!</span>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-card-bg p-6 rounded-2xl border border-card-border hover-card-lift col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Recent Achievements</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-surface border border-neutral-border hover:bg-neutral-bg transition-colors cursor-pointer group">
              <div className="h-14 w-14 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Flame size={28} />
              </div>
              <div className="text-center">
                <span className="block text-sm font-semibold text-text-primary">Hot Streak</span>
                <span className="block text-xs text-text-secondary mt-0.5">3-Day User</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-surface border border-neutral-border hover:bg-neutral-bg transition-colors cursor-pointer group hover:shadow-[0_0_15px_rgba(var(--color-brand-primary),0.15)]">
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Award size={28} />
              </div>
              <div className="text-center">
                <span className="block text-sm font-semibold text-text-primary">First Post</span>
                <span className="block text-xs text-text-secondary mt-0.5">Community</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-surface border border-neutral-border hover:bg-neutral-bg transition-colors cursor-pointer opacity-60 grayscale group">
              <div className="h-14 w-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Star size={28} />
              </div>
              <div className="text-center">
                <span className="block text-sm font-semibold text-text-primary">Top 10%</span>
                <span className="block text-xs text-text-secondary mt-0.5">Locked</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold text-text-primary mb-4 mt-8 flex items-center gap-2">
          <Clock size={20} className="text-brand-primary"/> Continue Where You Left Off
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => (
             <div key={i} className="bg-card-bg p-4 rounded-xl border border-card-border hover-card-lift group cursor-pointer relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="h-32 rounded-lg bg-neutral-surface mb-3 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300 shadow-inner">
                 <div className="h-10 w-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shadow-sm">
                    {i}
                 </div>
               </div>
               <h4 className="font-semibold text-text-primary transition-colors group-hover:text-brand-primary">Module Activity {i}</h4>
               <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                 <Clock size={12} /> Edited {i*2} hours ago
               </p>
             </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
