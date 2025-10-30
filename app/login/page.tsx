'use client';

import React, { useState } from 'react';
import { Loader2, QrCode, User, SendHorizontal } from 'lucide-react';

export default function QRDecoderClient() {
  const [result, setResult] = useState<string>('');
  const [usernameResult, setUsernameResult] = useState<string>('');
  const [showUsernameForm, setShowUsernameForm] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('x_start', '752');
    formData.append('y_start', '238');
    formData.append('x_end', '986');
    formData.append('y_end', '472');
    formData.append('adjusted', 'true');

    setLoading(true);
    const res = await fetch('/api/decode', { method: 'POST', body: formData });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setResult(`✅ พบรหัส: ${data.data}`);
      setUsernameResult(`Username: ${data.username}`);
      setUsername(data.username);
      setShowUsernameForm(true);
    } else {
      setResult(`❌ ${data.error}`);
    }
  }

  async function submitUsername() {
    if (!username) {
      setResult('❌ No username provided');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);

    setLoading(true);
    const res = await fetch('/api/renameuser', { method: 'POST', body: formData });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setUsernameResult(`✅ Username: ${data.username}`);
    } else {
      setUsernameResult(`❌ ${data.error}`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="flex items-center justify-center mb-6">
          <QrCode className="w-8 h-8 text-blue-400 mr-2" />
          <h2 className="text-2xl font-bold tracking-wide">QR Decoder</h2>
        </div>

        <div className="text-center mb-4 text-gray-300">
          📸 อัปโหลดภาพ บัตรกิลด์ เพื่อ Login
        </div>

        <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-600 hover:border-blue-400 transition-all rounded-lg p-6 cursor-pointer mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <p className="text-gray-400 text-sm">คลิกเพื่อเลือกภาพ หรือวางไฟล์ที่นี่</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center text-blue-400">
            <Loader2 className="animate-spin mr-2" />
            <span>กำลังประมวลผล...</span>
          </div>
        ) : (
          <div className="text-center space-y-2 mt-3">
            <p className="text-sm text-gray-300">{result}</p>
            <p className="text-sm text-gray-400">{usernameResult}</p>
          </div>
        )}

        {showUsernameForm && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
              <User className="text-gray-400" size={18} />
              <input
                type="text"
                placeholder="กรอกชื่อผู้ใช้ใหม่..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={submitUsername}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 transition-all px-4 py-2 rounded-lg font-medium shadow-md"
              >
                <SendHorizontal size={16} />
                เปลี่ยนชื่อ
              </button>

              <button
                onClick={() => window.location.replace('/')}
                className="bg-green-600 hover:bg-green-500 transition-all px-4 py-2 rounded-lg font-medium shadow-md"
              >
                เข้าเกม
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}