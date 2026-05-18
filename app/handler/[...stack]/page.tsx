'use client';

import { StackHandler } from '@stackframe/stack';
import { stackClientApp } from '@/stack-client';

export default function Handler(props: { params: Promise<{ stack: string[] }> }) {
  return <StackHandler fullPage app={stackClientApp} params={props.params} />;
}
