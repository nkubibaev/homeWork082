import axiosApi from "./axiosApi";

export const addTrackToHistory = async (trackId: string) => {
    await axiosApi.post('/track_history', {
        track: trackId,
    });
};