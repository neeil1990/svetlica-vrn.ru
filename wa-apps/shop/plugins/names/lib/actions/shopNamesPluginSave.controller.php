<?php

class shopNamesPluginSaveController extends waJsonController
{
    public function execute()
    {
       $id = waRequest::post('id');
       $name = waRequest::post('name');

        $model = new shopNamesPluginModel();

        if(!$model->getById($id)){
            $model->insert([
                'entity_id' => $id,
                'name' => $name
            ]);
        }else{
            $model->updateById($id, ['name' => $name]);
        }

       $this->response = [
           'id' => $id,
           'name' => $name,
       ];
    }

}
