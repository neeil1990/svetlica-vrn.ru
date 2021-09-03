<?php
class advantagesPostUpdateController extends waController
{
    protected $advantages;

    /**
     * advantagesPostSaveController constructor.
     * @throws waException
     */
    public function __construct()
    {
        $this->advantages = new advantagesPost();
    }

    /**
     * @throws waDbException
     * @throws waException
     */
    public function execute()
    {
        $model = new advantagesModel();

        $data = waRequest::post();
        $file = waRequest::file('img');

        if($file->uploaded()){
            if($file->moveTo($this->advantages->path('img/uploaded'), $file->name))
                $data['img'] = $file->name;
        }

        $model->updateById($data['id'], $data);

        $this->redirect(array(
            'module' => 'backend'
        ));
    }


}
