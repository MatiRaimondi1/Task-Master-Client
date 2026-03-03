import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function VerifyEmail({ email, onVerifySuccess }) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onVerifySuccess(email, code);
            toast.success("Email verified successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Incorrect code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Verify your email</h2>
            <p className="text-slate-500 mb-8">We've sent a code to <br /> <span className="font-bold text-slate-800">{email}</span></p>

            <form onSubmit={handleVerify} className="space-y-4">
                <input
                    type="text"
                    maxLength="6"
                    placeholder="000000"
                    className="w-full text-center text-3xl tracking-[1rem] font-black py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Verify Account"}
                </button>
            </form>
        </div>
    );
}