package com.tairanchina.csp.avm.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.tairanchina.csp.avm.entity.AndroidVersion;
import com.tairanchina.csp.avm.entity.BasicEntity;
import com.tairanchina.csp.avm.mapper.AndroidVersionMapper;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;


public class BasicServiceTest extends BaseTest {

    private static final Logger logger = LoggerFactory.getLogger(BasicServiceTest.class);

    @Autowired
    BasicService basicService;

    @Autowired
    AndroidVersionMapper androidVersionMapper;

    @Test
    public void formatCreatedByBasicEntity() throws Exception {
        BasicEntity basicEntity = new BasicEntity();
        basicEntity.setCreatedBy("b9e980c1495e4d0582c257901d86b4ff");
        logger.info("formatCreatedBy前：" + basicEntity.getCreatedBy());
        basicService.formatCreatedBy(basicEntity);
        logger.info("formatCreatedBy后：" + basicEntity.getCreatedBy());
    }

    @Test
    public void sortAndroidVersion() throws Exception{
        EntityWrapper<AndroidVersion> androidVersionEntityWrapper = new EntityWrapper<>();
        androidVersionEntityWrapper.and().eq("app_id", 24);
        androidVersionEntityWrapper.and().eq("del_flag", 0);
        androidVersionEntityWrapper.orderBy("app_version", false);

        List<AndroidVersion> list  = androidVersionMapper.selectList(androidVersionEntityWrapper);
        List<AndroidVersion> result = basicService.sortAndroidVersion(list,true);
        System.out.println(result);
    }

}