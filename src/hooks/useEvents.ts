import { useState, useEffect, useCallback } from 'react';
import { useActiveOrg } from './useActiveOrg';
import { useSubscription } from './useSubscirptionservcies';
import * as eventService from '../services/eventServices';
import { isAtMonthlyEventLimit, getPlanLimits, getEffectivePlanForLimits } from '../utils/planLimits';
import type { Database } from '../types/database.types';

type EventRow = Database['public']['Tables']['events']['Row'];

function countEventsThisMonth(events: EventRow[]): number {
  const now = new Date();
  return events.filter((e) => {
    const d = new Date(e.start_time);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
}

export function useEvents() {
  const { activeOrg } = useActiveOrg();
  const { currentPlan, isExpired } = useSubscription();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!activeOrg) {
      setEvents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await eventService.getEventsForOrg(activeOrg.id);
    setEvents(data);
    setLoading(false);
  }, [activeOrg]);

  useEffect(() => {
    load();
  }, [load]);

  const createEvent = async (params: {
    title: string;
    startTime: string;
    endTime: string;
    groupId?: string;
    description?: string;
    location?: string;
    isMandatory: boolean;
  }) => {
    if (!activeOrg) throw new Error('No active organization');

    const effectivePlan = getEffectivePlanForLimits(currentPlan, isExpired);
    const eventsThisMonth = countEventsThisMonth(events);
    if (isAtMonthlyEventLimit(effectivePlan, eventsThisMonth)) {
      throw new Error(
        `Your ${effectivePlan} plan allows up to ${getPlanLimits(effectivePlan).maxEventsPerMonth} events per month. Upgrade to add more.`
      );
    }

    await eventService.createEvent({ orgId: activeOrg.id, ...params });
    await load();
  };

  const updateEvent = async (eventId: string, updates: Parameters<typeof eventService.updateEvent>[1]) => {
    await eventService.updateEvent(eventId, updates);
    await load();
  };

  const deleteEvent = async (eventId: string) => {
    await eventService.deleteEvent(eventId);
    await load();
  };

  return { events, loading, createEvent, updateEvent, deleteEvent, refresh: load };
}