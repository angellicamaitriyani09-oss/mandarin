<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Module;
use App\Models\ModuleComment;
use App\Models\QuestionBank;
use App\Models\UserProgress;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MandarinkuApiController extends Controller
{
    /**
     * Get Module Ajar list with comments and uploader info.
     */
    public function getModules(Request $request)
    {
        $category = $request->query('category');
        $level = $request->query('level');

        $query = Module::with(['uploader:id,name,avatar', 'comments.user:id,name,avatar']);
        if ($category) $query->where('category', $category);
        if ($level) $query->where('hsk_level', $level);

        return response()->json([
            'status' => 'success',
            'data' => $query->latest()->get()
        ]);
    }

    /**
     * Upload new Module (Guru / Pemilik / Admin only).
     */
    public function uploadModule(Request $request)
    {
        $user = Auth::user();
        if (!$user || !in_array($user->role, ['teacher', 'admin'])) {
            return response()->json(['status' => 'error', 'message' => 'Akses ditolak. Hanya Guru/Admin yang dapat mengunggah modul.'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:listening,speaking,reading,writing',
            'hsk_level' => 'required|string',
            'description' => 'required|string',
            'file' => 'nullable|mimes:pdf,zip,doc,docx|max:20480'
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('modules', 'public');
        }

        $module = Module::create([
            'user_id' => $user->id,
            'title' => $request->title,
            'category' => $request->category,
            'hsk_level' => $request->hsk_level,
            'description' => $request->description,
            'file_path' => $filePath
        ]);

        return response()->json(['status' => 'success', 'message' => 'Modul berhasil diterbitkan.', 'data' => $module], 201);
    }

    /**
     * Add comment / review to module.
     */
    public function addComment(Request $request, $moduleId)
    {
        $request->validate([
            'comment' => 'required|string',
            'rating' => 'nullable|integer|min:1|max:5'
        ]);

        $comment = ModuleComment::create([
            'module_id' => $moduleId,
            'user_id' => Auth::id(),
            'comment' => $request->comment,
            'rating' => $request->rating ?? 5
        ]);

        return response()->json(['status' => 'success', 'data' => $comment->load('user:id,name,avatar')]);
    }

    /**
     * Download Module File and increment counter.
     */
    public function downloadModule($moduleId)
    {
        $module = Module::findOrFail($moduleId);
        $module->increment('download_count');

        if ($module->file_path && Storage::disk('public')->exists($module->file_path)) {
            return Storage::disk('public')->download($module->file_path, $module->title . '.pdf');
        }

        return response()->json(['status' => 'success', 'message' => 'Simulasi unduhan berhasil.']);
    }

    /**
     * Get Question Bank by HSK Level (1 - 6).
     */
    public function getBankQuestions($level)
    {
        $questions = QuestionBank::where('hsk_level', $level)->get();
        return response()->json(['status' => 'success', 'data' => $questions]);
    }

    /**
     * AI Grammar Checker Endpoint (Proxy / Built-in Engine).
     */
    public function checkAIGrammar(Request $request)
    {
        $request->validate(['text' => 'required|string']);
        $text = $request->text;

        // Pattern matching / AI Grammar Engine
        $corrections = [];
        $score = 95;
        $correctedText = $text;

        if (str_contains($text, '他们') && (str_contains($text, '苹果') || str_contains($text, '菜'))) {
            $correctedText = str_replace('他们', '它们', $text);
            $corrections[] = "Gunakan kata ganti '它们' (tāmen) untuk merujuk pada benda/makanan, bukan '他们'.";
            $score = 88;
        }

        return response()->json([
            'status' => 'success',
            'original_text' => $text,
            'corrected_text' => $correctedText,
            'score' => $score,
            'notes' => $corrections
        ]);
    }
}
