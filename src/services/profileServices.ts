import { supabase } from '../lib/supabase';
import type { Profile } from '../types/domain.types';
import {type  UpdateProfilePayload } from '../types/auth.types';

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// A profile counts as "incomplete" if full_name is missing/placeholder or phone is empty
export function isProfileComplete(profile: Profile): boolean {
  const hasRealName = !!profile.full_name && profile.full_name !== 'New User';
  const hasPhone = !!profile.phone;
  return hasRealName && hasPhone;
}



export async function updateProfile(userId: string, payload: UpdateProfilePayload): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: payload.fullName,
      phone: payload.phone,
      avatar_url: payload.avatarUrl ?? null,
    })
    .eq('id', userId);

  if (error) throw error;
}


export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
  const cacheBustedUrl = `${urlData.publicUrl}?t=${Date.now()}`;

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: cacheBustedUrl })
    .eq('id', userId);

  if (updateError) throw updateError;

  return cacheBustedUrl;
}