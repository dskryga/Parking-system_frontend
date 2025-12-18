<script setup lang="ts">
import { OfficeBuilding, Ticket } from '@element-plus/icons-vue'
</script>

<template>
  <el-container>
    <el-header style="background-color: #409eff; color: white; display: flex; align-items: center;">
      <h2 style="margin: 0">Система управления автостоянкой</h2>
    </el-header>

    <el-container>
      <el-aside width="200px" style="background-color: #f0f2f5;">
        <el-menu 
          router 
          :default-active="$route.path" 
          style="height: 100%; border-right: none;"
        >
          <el-menu-item index="/">
            <el-icon>
              <office-building />
            </el-icon>
            <span>Учет мест и автомобилей</span>  
          </el-menu-item>
          
          <el-menu-item index="/booking">
            <el-icon>
              <ticket />
            </el-icon>
            <span>Бронирование и оплата</span>
          </el-menu-item>   
        </el-menu>
      </el-aside>
      
      <el-main style="padding: 20px;">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>