<?php

class advantagesPostDeleteController extends waJsonController
{
    /**
     * @throws waDbException
     * @throws waException
     */
    public function execute()
    {
        $model = new advantagesModel();
        if(!$model->deleteById(waRequest::post('id')))
            throw new Exception('Delete error.');
    }

}
