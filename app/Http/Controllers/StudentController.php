<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::all();

        return response()->json($students, 200);
    }

    public function show($id)
    {
        $student = Student::findOrFail($id);

        return response()->json($student, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:students,email'],
            'course' => ['required', 'string', 'max:255'],
        ]);

        $student = new Student();
        $student->name = $validated['name'];
        $student->email = $validated['email'];
        $student->course = $validated['course'];
        $student->save();

        return response()->json([
            'message' => 'Student created successfully.',
            'student' => $student,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                Rule::unique('students', 'email')->ignore($student->id),
            ],
            'course' => ['required', 'string', 'max:255'],
        ]);

        $student->name = $validated['name'];
        $student->email = $validated['email'];
        $student->course = $validated['course'];
        $student->save();

        return response()->json([
            'message' => 'Student updated successfully.',
            'student' => $student,
        ], 200);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return response()->json([
            'message' => 'Student deleted successfully.',
        ], 200);
    }
}
