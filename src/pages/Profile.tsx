
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseProfile } from '@/lib/types.d';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Edit2, Save, User } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<SupabaseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFirstName(data?.first_name || '');
      setLastName(data?.last_name || '');
      setAvatarUrl(data?.avatar_url || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      let newAvatarUrl = avatarUrl;

      // Handle avatar upload if there's a new one
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const filePath = `${user.id}/avatar.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('recipe_images')
          .upload(filePath, avatar, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('recipe_images')
          .getPublicUrl(filePath);

        newAvatarUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString() // Fix: Convert Date to ISO string
        })
        .eq('id', user.id);

      if (error) throw error;

      setAvatarUrl(newAvatarUrl);
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          first_name: firstName,
          last_name: lastName,
          avatar_url: newAvatarUrl
        };
      });
      
      setEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
      // Create a preview URL for immediate display
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-28 w-28">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Profile" />
                ) : (
                  <AvatarFallback className="text-2xl">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                )}
              </Avatar>
              {editing && (
                <div className="mt-2">
                  <Label htmlFor="avatar" className="block mb-1 text-center">Change Avatar</Label>
                  <Input 
                    id="avatar" 
                    type="file" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="max-w-xs"
                  />
                </div>
              )}
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold">
                {profile?.first_name || user?.email?.split('@')[0] || 'User'} {profile?.last_name || ''}
              </h3>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            {editing ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="bg-gray-50"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2 border rounded-md p-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">First Name</p>
                    <p>{profile?.first_name || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Name</p>
                    <p>{profile?.last_name || 'Not set'}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{user?.email}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {editing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProfile} 
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={handleLogout}
              >
                Sign Out
              </Button>
              <Button 
                onClick={() => setEditing(true)}
              >
                <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
