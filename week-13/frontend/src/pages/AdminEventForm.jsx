import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";

function AdminEventForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "Other",
        date: "",
        location: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(isEdit);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (!isEdit) return;
        async function load() {
            try {
                const res = await api.get(`/events/${id}`);
                const e = res.data.data;
                setForm({
                    title: e.title,
                    description: e.description,
                    category: e.category,
                    date: e.date ? e.date.split("T")[0] : "",
                    location: e.location
                });
            } catch (err) {
                setError("Failed to load event");
            } finally {
                setLoadingData(false);
            }
        }
        load();
    }, [id, isEdit]);

    function handleChange(field) {
        return (e) => setForm({ ...form, [field]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let eventId = id;
            if (isEdit) {
                await api.put(`/events/${id}`, form);
            } else {
                const res = await api.post("/events", form);
                eventId = res.data.data._id;
            }

            if (imageFile && eventId) {
                const fd = new FormData();
                fd.append("image", imageFile);
                await api.post(`/events/${eventId}/image`, fd, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            navigate("/admin/events");
        } catch (err) {
            setError(err.response?.data?.message || "Save failed");
        } finally {
            setLoading(false);
        }
    }

    if (loadingData) return <p style={{ textAlign: "center", marginTop: "80px", color: "#a3a3a3" }}>Loading...</p>;

    return (
        <div style={{
            maxWidth: "520px",
            margin: "60px auto",
            padding: "40px",
            background: "#1a1a1a",
            borderRadius: "16px",
            border: "1.5px solid #262626"
        }}>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "24px", letterSpacing: "-0.02em", color: "#f5f5f5" }}>
                {isEdit ? "Edit Event" : "Create Event"}
            </h1>

            {error && (
                <div style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "#f87171",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "14px",
                    border: "1px solid rgba(239, 68, 68, 0.3)"
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <Input label="Title" value={form.title} onChange={handleChange("title")} />
                <Input label="Description" value={form.description} onChange={handleChange("description")} />
                <Input label="Location" value={form.location} onChange={handleChange("location")} />

                <label style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#a3a3a3",
                    letterSpacing: "0.02em"
                }}>
                    Category
                </label>
                <select
                    value={form.category}
                    onChange={handleChange("category")}
                    style={{
                        width: "100%",
                        padding: "12px 14px",
                        border: "1.5px solid #262626",
                        borderRadius: "8px",
                        fontSize: "14px",
                        marginBottom: "18px",
                        background: "#1a1a1a",
                        color: "#f5f5f5",
                        outline: "none"
                    }}
                >
                    <option value="Music">Music</option>
                    <option value="Tech">Tech</option>
                    <option value="Sports">Sports</option>
                    <option value="Art">Art</option>
                    <option value="Other">Other</option>
                </select>

                <Input label="Date" type="date" value={form.date} onChange={handleChange("date")} />

                <label style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#a3a3a3",
                    letterSpacing: "0.02em"
                }}>
                    Image (optional)
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    style={{
                        marginBottom: "24px",
                        display: "block",
                        color: "#a3a3a3",
                        fontSize: "13px"
                    }}
                />

                <Button text={loading ? "Saving..." : "Save"} type="submit" disabled={loading} fullWidth />
            </form>
        </div>
    );
}

export default AdminEventForm;
