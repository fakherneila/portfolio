import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  Boxes,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Cloud,
  Code,
  Cpu,
  Copy,
  Database,
  Download,
  ExternalLink,
  Figma,
  FileCode,
  GitBranch,
  Github,
  Globe,
  GraduationCap,
  Layers,
  Linkedin,
  Info,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Moon,
  Palette,
  Send,
  Server,
  Sparkles,
  Sun,
  Terminal,
  TestTube,
  TrendingUp,
  Workflow,
  X,
  Zap,
  Bot,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap = {
  Sun, Moon, Globe, Menu, X, ArrowRight, ArrowDown, ArrowUp, ArrowLeft, Download, Mail, Github,
  Linkedin, ExternalLink, Code, Database, Server, Cloud, Palette, Bot, Workflow, TrendingUp,
  TestTube, Figma, FileCode, Layers, Zap, Award, Briefcase, GraduationCap, MapPin, Calendar,
  CheckCircle2, AlertCircle, Loader2, Send, Sparkles, Terminal, Cpu, Boxes, GitBranch,
  AlertTriangle, Check, Copy, Info, ChevronRight, ChevronLeft,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof iconMap

type IconProps = {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
}

export function Icon({ name, size = 18, className, strokeWidth = 1.75 }: IconProps) {
  const LucideIcon = iconMap[name]
  return <LucideIcon aria-hidden="true" className={cn('shrink-0', className)} size={size} strokeWidth={strokeWidth} />
}
