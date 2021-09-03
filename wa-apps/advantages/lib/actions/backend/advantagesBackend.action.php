<?php
class advantagesBackendAction extends waViewAction
{

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
        $model = new advantagesModel();

        $advantages = $model->order('id DESC')->fetchAll();
        $advantages = array_map(function ($val){
            $val['img'] = $this->advantages->getImagesPath($val['img']);
            return $val;
        }, $advantages);

        $this->view->assign(compact('advantages'));
        $this->setLayout(new advantagesDefaultLayout());
    }

}
