<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\SurveyQuestion;
use App\Http\Requests\SurveyRequest;
use Illuminate\Support\Facades\File;
use Illuminate\Auth\Events\Validated;
use Illuminate\Validation\Rules\Enum;
use App\Http\Resources\SurveyResource;
use App\Http\Requests\SurveyStoreRequest;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\SurveyUpdateRequest;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user =  $request->user();
        return SurveyResource::collection(
        Survey::where('user_id', $user->id)->orderBy('created_at','DESC')->paginate(5));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SurveyStoreRequest $request)
    {
        $user= $request->user();
        $data = $request->validate();
        if(isset($data['image'])){
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }
        $survey = Survey::create($data);
        
        //create new questions
        foreach($data['questions'] as $question){
            $question['survey_id'] = $survey->id;
            $this->createQuestion($question);
        }
        return new SurveyResource($survey);
    }
    /**
     * Display the specified resource.
     */
    public function show(Survey $survey,Request $request)
    {
        $user = $request->user();
        if($user->id !== $survey->user_id){
            return abort(403,'Unauthorized Action');
        }
        return new SurveyResource($survey);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SurveyUpdateRequest $request, Survey $survey)
    {
        $data = $request->validated();
        //check if image was given and save image on local file system
        if(isset($data['image'])){
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;

            //if there is an old image, remove it
            if($survey->image){
                   $absolutePath = public_path($survey->image);
                   File::delete($absolutePath);
            }
        }
        //update  survey in the database
        $survey->update($data);

        //Get ids as the plain array of existing questions
        $existingIds = $survey->questions()->pluck('id')->toArray();

        //Get ids as plain array of new questions
        $newIds = Arr::pluck($data['questions'], 'id');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    /**
     * Save image in local file system and return saved image path
     *
     * @param $image
     * @throws \Exception
     * @author  Asma khan
     */
    private function saveImage($image){
    //check if image is valid based64 string
    if(preg_match('/^data:image\/(\w+);base64,/', $image, $type)){
         $image = substr($image,strpos($image,',')+1);
         //get file extension
         $type = strtolower($type[1]);
         //check if file is an image
         if(!in_array($type,['jpg','jpeg','gif','png'])){
            throw new \Exception('invalid image type');
    }
    $image = str_replace('','+',$image);
    $image = base64_decode($image);
    if($image === false){
        throw new \Exception('base64_decode failed');
    }
}else{
    throw new \Exception('did not match data URI with image data');
}
$dir = 'images/';
$file = Str::random(). '.' . $type;
$absolutePath = public_path($dir);
$relativePath = $dir . $file;
if(!File::exists($absolutePath)){
    File::makeDirectory($absolutePath, 0755,true);
}
file_put_contents($relativePath,$image);
return $relativePath;
}

/**
     * Create a question and return
     *
     * @param $data
     * @return mixed
     * @throws \Illuminate\Validation\ValidationException
     * @author Asma Khan
     *  <zurasekhniashvili@gmail.com>
     */
    private function createQuestion($data){
        if(is_array($data['data'])){
            $data['data'] = json_encode($data['data']);
        }
        $validator = Validator::make($data,['question'=>'required|string',
         'type'=>['required', new Enum(QuestionTypeEnum::class)],
         'description'=>'nullable|string',
          'data'=>'present',
          'survey_id'=>'exists:App\Models\Survey,id']);
          return SurveyQuestion::create($validator->validated());
    }
}
