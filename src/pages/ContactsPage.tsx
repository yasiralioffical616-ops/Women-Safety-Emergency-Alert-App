import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { contactService } from '../services/safetyService';
import { EmergencyContact } from '../types';
import {
  Users,
  UserPlus,
  Phone,
  MessageCircle,
  Star,
  Trash2,
  Edit2,
  X,
  Check,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { generateTelUrl, generateWhatsAppEmergencyUrl } from '../lib/utils';

export const ContactsPage: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('Sister');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadContacts = async () => {
    setIsLoading(true);
    const data = await contactService.getContacts(user?.id || 'user-demo-id');
    setContacts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, [user]);

  const openAddModal = () => {
    if (contacts.length >= 5) {
      alert('You have reached the maximum of 5 trusted emergency contacts.');
      return;
    }
    setEditingContact(null);
    setFullName('');
    setRelationship('Sister');
    setPhone('');
    setWhatsapp('');
    setEmail('');
    setIsPrimary(contacts.length === 0);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (c: EmergencyContact) => {
    setEditingContact(c);
    setFullName(c.full_name);
    setRelationship(c.relationship);
    setPhone(c.phone);
    setWhatsapp(c.whatsapp_number);
    setEmail(c.email || '');
    setIsPrimary(c.is_primary);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !whatsapp.trim()) {
      setFormError('Please fill in Full Name, Phone Number, and WhatsApp Number.');
      return;
    }

    if (editingContact) {
      await contactService.updateContact(editingContact.id, {
        full_name: fullName.trim(),
        relationship,
        phone: phone.trim(),
        whatsapp_number: whatsapp.trim(),
        email: email.trim() || undefined,
        is_primary: isPrimary,
      });
    } else {
      await contactService.addContact(user?.id || 'user-demo-id', {
        full_name: fullName.trim(),
        relationship,
        phone: phone.trim(),
        whatsapp_number: whatsapp.trim(),
        email: email.trim() || undefined,
        is_primary: isPrimary,
      });
    }

    setModalOpen(false);
    await loadContacts();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this emergency contact?')) {
      await contactService.deleteContact(id);
      await loadContacts();
    }
  };

  const handleSetPrimary = async (c: EmergencyContact) => {
    await contactService.updateContact(c.id, { is_primary: true });
    await loadContacts();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F766E] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Safety Circle ({contacts.length}/5 Saved)</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#173B6C] tracking-tight">
              Trusted Emergency Contacts
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              These are the guardians alerted when you activate SOS or schedule a safety check-in.
            </p>
          </div>

          <button
            onClick={openAddModal}
            disabled={contacts.length >= 5}
            className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] disabled:bg-slate-300 text-white font-bold text-xs shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 min-h-[44px]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Trusted Contact</span>
          </button>
        </div>

        {/* Contact List */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Contacts Added Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              Add at least one trusted friend, parent, or roommate so you can immediately dispatch alerts in an emergency.
            </p>
            <button
              onClick={openAddModal}
              className="px-6 py-2.5 rounded-xl bg-[#0F766E] text-white font-bold text-xs shadow hover:bg-teal-700"
            >
              Add Your First Contact
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((c) => (
              <div
                key={c.id}
                className={`bg-white rounded-2xl p-5 border transition-all ${
                  c.is_primary
                    ? 'border-[#0F766E] shadow-sm ring-1 ring-[#0F766E]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 truncate">
                        {c.full_name}
                      </h3>
                      {c.is_primary && (
                        <span className="bg-teal-100 text-[#0F766E] text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-teal-600" />
                          <span>Primary Guardian</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {c.relationship}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!c.is_primary && (
                      <button
                        onClick={() => handleSetPrimary(c)}
                        title="Set as primary contact"
                        className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(c)}
                      title="Edit contact"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      title="Delete contact"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contact Numbers */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-400 w-16">Phone:</span>
                    <span className="font-mono text-slate-800 font-semibold">{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-400 w-16">WhatsApp:</span>
                    <span className="font-mono text-slate-800 font-semibold">{c.whatsapp_number}</span>
                  </div>
                  {c.email && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-400 w-16">Email:</span>
                      <span className="text-slate-600 truncate">{c.email}</span>
                    </div>
                  )}
                </div>

                {/* Quick Action Triggers */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                  <a
                    href={generateTelUrl(c.phone)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 min-h-[44px]"
                  >
                    <Phone className="w-4 h-4 text-[#173B6C]" />
                    <span>Direct Call</span>
                  </a>
                  <a
                    href={generateWhatsAppEmergencyUrl(
                      c.whatsapp_number,
                      'https://maps.google.com',
                      user?.full_name
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 min-h-[44px]"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Test</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-[#173B6C] mb-1">
                {editingContact ? 'Edit Trusted Contact' : 'Add New Trusted Contact'}
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Make sure the phone and WhatsApp numbers are active with country code (e.g. +92).
              </p>

              {formError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveContact} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Relationship *
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white"
                  >
                    <option value="Sister">Sister</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Brother">Brother</option>
                    <option value="Friend">Friend</option>
                    <option value="Roommate">Hostel Roommate</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Spouse">Spouse / Partner</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="primaryCheck"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="w-4 h-4 text-[#0F766E] rounded focus:ring-teal-500 border-slate-300"
                  />
                  <label htmlFor="primaryCheck" className="text-xs font-semibold text-slate-700">
                    Set as Primary Guardian (Receives immediate direct call & WhatsApp during SOS)
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-xs shadow"
                  >
                    {editingContact ? 'Save Changes' : 'Add Contact'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
