<?php
class advantagesPostEditAction extends waViewAction
{
    protected $action = 'save';
    protected $advantages;

    /**
     * advantagesBackendAction constructor.
     */
    public function __construct()
    {
        parent::__construct();

        $this->advantages = new advantagesPost();
    }

    public function execute()
    {
        if($id = waRequest::get('id')){
            $this->action = 'update';
            $model = new advantagesModel();
            $advantage = $model->getById($id);
            $advantage['img'] = $this->advantages->getImagesPath($advantage['img']);
            $this->view->assign(compact('advantage'));
        }

        $this->view->assign('action', $this->action);
        $this->setLayout(new advantagesDefaultLayout());
    }
}
